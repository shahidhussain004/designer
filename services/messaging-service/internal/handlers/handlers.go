package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/designer/messaging-service/internal/db"
	"github.com/designer/messaging-service/internal/models"
	"github.com/designer/messaging-service/internal/redis"
	"github.com/designer/messaging-service/internal/websocket"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	ws "github.com/gorilla/websocket"
)

var upgrader = ws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
}

// HandleWebSocket upgrades HTTP connection to WebSocket
func HandleWebSocket(hub *websocket.Hub, jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from query parameter
		tokenString := c.Query("token")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
			return
		}

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid claims"})
			return
		}

		// Extract user ID from claims
		userIDFloat, ok := claims["userId"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
			return
		}
		userID := int64(userIDFloat)

		// Upgrade to WebSocket
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}

		// Create client and register with hub
		client := websocket.NewClient(hub, conn, userID)
		hub.Register(client)

		// Start read and write pumps
		go client.WritePump()
		go client.ReadPump()
	}
}

// GetThreads returns all message threads for the current user
func GetThreads(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")

		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

		threads, err := database.GetThreadsByUser(c.Request.Context(), userID, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get threads"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"threads": threads,
			"count":   len(threads),
		})
	}
}

// GetThread returns a specific thread
func GetThread(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")
		threadID, err := uuid.Parse(c.Param("threadId"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
			return
		}

		thread, err := database.GetThread(c.Request.Context(), threadID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get thread"})
			return
		}

		if thread == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}

		// Verify user is a participant
		isParticipant := false
		for _, p := range thread.Participants {
			if p == userID {
				isParticipant = true
				break
			}
		}

		if !isParticipant {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not a thread participant"})
			return
		}

		c.JSON(http.StatusOK, thread)
	}
}

// GetMessages returns messages from a thread
func GetMessages(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")
		threadID, err := uuid.Parse(c.Param("threadId"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
			return
		}

		// Verify thread access
		thread, err := database.GetThread(c.Request.Context(), threadID)
		if err != nil || thread == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}

		isParticipant := false
		for _, p := range thread.Participants {
			if p == userID {
				isParticipant = true
				break
			}
		}

		if !isParticipant {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not a thread participant"})
			return
		}

		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

		messages, err := database.GetMessages(c.Request.Context(), threadID, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get messages"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"messages": messages,
			"count":    len(messages),
		})
	}
}

// CreateThread creates a new message thread
func CreateThread(database *db.PostgresDB, hub *websocket.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")

		var req models.CreateThreadRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Check if thread already exists between these users
		existing, err := database.GetThreadByParticipants(c.Request.Context(), userID, req.ParticipantID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing thread"})
			return
		}

		if existing != nil {
			c.JSON(http.StatusOK, existing)
			return
		}

		// Create new thread
		participants := []int64{userID, req.ParticipantID}
		thread, err := database.CreateThread(c.Request.Context(), participants, req.JobID, req.Title)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
			return
		}

		// Send initial message if provided
		if req.InitialMessage != "" {
			msg := &models.Message{
				ID:         uuid.New(),
				ThreadID:   thread.ID,
				SenderID:   userID,
				ReceiverID: req.ParticipantID,
				Body:       req.InitialMessage,
			}

			if err := hub.SendMessage(c.Request.Context(), msg, participants); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send initial message"})
				return
			}
		}

		c.JSON(http.StatusCreated, thread)
	}
}

// SendMessage sends a message in a thread
func SendMessage(database *db.PostgresDB, hub *websocket.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")
		threadID, err := uuid.Parse(c.Param("threadId"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
			return
		}

		var req models.SendMessageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Verify thread access
		thread, err := database.GetThread(c.Request.Context(), threadID)
		if err != nil || thread == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found"})
			return
		}

		isParticipant := false
		var receiverID int64
		for _, p := range thread.Participants {
			if p == userID {
				isParticipant = true
			} else {
				receiverID = p
			}
		}

		if !isParticipant {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not a thread participant"})
			return
		}

		// Create and send message
		msg := &models.Message{
			ID:          uuid.New(),
			ThreadID:    threadID,
			SenderID:    userID,
			ReceiverID:  receiverID,
			Body:        req.Body,
			Attachments: req.Attachments,
		}

		if err := hub.SendMessage(c.Request.Context(), msg, thread.Participants); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
			return
		}

		c.JSON(http.StatusCreated, msg)
	}
}

// MarkMessageRead marks a message as read
func MarkMessageRead(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")
		messageID, err := uuid.Parse(c.Param("messageId"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
			return
		}

		if err := database.MarkMessageRead(c.Request.Context(), messageID, userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark message as read"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// GetOnlineUsers returns all currently online users
func GetOnlineUsers(redisClient *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		onlineUsers, err := redisClient.GetOnlineUsers(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get online users"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"onlineUsers": onlineUsers,
			"count":       len(onlineUsers),
		})
	}
}

// GetUserPresence returns presence information for a specific user
func GetUserPresence(redisClient *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := strconv.ParseInt(c.Param("userId"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		presence, err := redisClient.GetUserPresence(c.Request.Context(), userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user presence"})
			return
		}

		c.JSON(http.StatusOK, presence)
	}
}

// GetNotifications returns notifications for the current user
func GetNotifications(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")

		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

		notifications, err := database.GetNotifications(c.Request.Context(), userID, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get notifications"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"notifications": notifications,
			"count":         len(notifications),
		})
	}
}

// MarkNotificationRead marks a notification as read
func MarkNotificationRead(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")
		notificationID, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification ID"})
			return
		}

		if err := database.MarkNotificationRead(c.Request.Context(), notificationID, userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark notification as read"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// MarkAllNotificationsRead marks all notifications as read
func MarkAllNotificationsRead(database *db.PostgresDB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt64("userId")

		if err := database.MarkAllNotificationsRead(c.Request.Context(), userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark notifications as read"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// MetricsHandler returns basic metrics
func MetricsHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Basic Prometheus-compatible metrics
		metrics := `# HELP messaging_service_up Indicates if the messaging service is running
# TYPE messaging_service_up gauge
messaging_service_up 1
`
		c.Data(http.StatusOK, "text/plain; charset=utf-8", []byte(metrics))
	}
}

// parseToken parses JWT token from Authorization header
func parseToken(authHeader, secret string) (*jwt.Token, error) {
	if authHeader == "" {
		return nil, fmt.Errorf("no authorization header")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return nil, fmt.Errorf("invalid authorization header format")
	}

	return jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
}
