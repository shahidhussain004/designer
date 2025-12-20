package websocket

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/designer/messaging-service/internal/db"
	"github.com/designer/messaging-service/internal/models"
	"github.com/designer/messaging-service/internal/redis"
	goredis "github.com/go-redis/redis/v8"
	"github.com/google/uuid"
)

// Hub manages WebSocket connections and message routing
type Hub struct {
	// Registered clients by user ID
	clients map[int64]map[*Client]bool

	// Register requests
	register chan *Client

	// Unregister requests
	unregister chan *Client

	// Broadcast messages to specific users
	broadcast chan *BroadcastMessage

	// Redis client for pub/sub
	redis *redis.Client

	// Database for persistence
	db *db.PostgresDB

	// Mutex for thread-safe client access
	mu sync.RWMutex
}

// BroadcastMessage represents a message to broadcast to specific users
type BroadcastMessage struct {
	UserIDs []int64
	Message *models.WSMessage
}

// NewHub creates a new WebSocket hub
func NewHub(redisClient *redis.Client, database *db.PostgresDB) *Hub {
	return &Hub{
		clients:    make(map[int64]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *BroadcastMessage, 256),
		redis:      redisClient,
		db:         database,
	}
}

// Run starts the hub's main event loop
func (h *Hub) Run() {
	// Subscribe to Redis pub/sub channels
	ctx := context.Background()
	pubsub := h.redis.Subscribe(ctx, "presence", "notifications:*")
	defer pubsub.Close()

	// Handle Redis messages in goroutine
	go h.handleRedisPubSub(pubsub)

	for {
		select {
		case client := <-h.register:
			h.registerClient(client)

		case client := <-h.unregister:
			h.unregisterClient(client)

		case message := <-h.broadcast:
			h.broadcastToUsers(message)
		}
	}
}

// registerClient adds a client to the hub
func (h *Hub) registerClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.clients[client.UserID] == nil {
		h.clients[client.UserID] = make(map[*Client]bool)
	}
	h.clients[client.UserID][client] = true

	// Set user as online in Redis
	ctx := context.Background()
	h.redis.SetUserOnline(ctx, client.UserID, "available")

	// Publish presence update
	h.redis.PublishPresenceUpdate(ctx, client.UserID, true)

	log.Printf("Client registered: user %d, total connections: %d", client.UserID, len(h.clients[client.UserID]))
}

// Register adds a client to the hub via channel
func (h *Hub) Register(client *Client) {
	h.register <- client
}

// unregisterClient removes a client from the hub
func (h *Hub) unregisterClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.clients[client.UserID]; ok {
		if _, exists := clients[client]; exists {
			delete(clients, client)
			close(client.send)

			// If no more connections for this user, mark offline
			if len(clients) == 0 {
				delete(h.clients, client.UserID)

				ctx := context.Background()
				h.redis.SetUserOffline(ctx, client.UserID)
				h.redis.PublishPresenceUpdate(ctx, client.UserID, false)
			}

			log.Printf("Client unregistered: user %d", client.UserID)
		}
	}
}

// broadcastToUsers sends a message to specific users
func (h *Hub) broadcastToUsers(bm *BroadcastMessage) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	data, err := json.Marshal(bm.Message)
	if err != nil {
		log.Printf("Failed to marshal broadcast message: %v", err)
		return
	}

	for _, userID := range bm.UserIDs {
		if clients, ok := h.clients[userID]; ok {
			for client := range clients {
				select {
				case client.send <- data:
				default:
					// Client buffer full, skip
					log.Printf("Client buffer full for user %d", userID)
				}
			}
		}
	}
}

// SendToUser sends a message to a specific user
func (h *Hub) SendToUser(userID int64, message *models.WSMessage) {
	h.broadcast <- &BroadcastMessage{
		UserIDs: []int64{userID},
		Message: message,
	}
}

// SendToUsers sends a message to multiple users
func (h *Hub) SendToUsers(userIDs []int64, message *models.WSMessage) {
	h.broadcast <- &BroadcastMessage{
		UserIDs: userIDs,
		Message: message,
	}
}

// SendMessage sends a chat message and broadcasts to thread participants
func (h *Hub) SendMessage(ctx context.Context, msg *models.Message, participants []int64) error {
	// Persist message to database
	if err := h.db.CreateMessage(ctx, msg); err != nil {
		return err
	}

	// Broadcast to all participants
	wsMessage := &models.WSMessage{
		Type:    models.WSTypeMessage,
		Payload: msg,
	}

	h.SendToUsers(participants, wsMessage)
	return nil
}

// SendTypingIndicator broadcasts a typing indicator
func (h *Hub) SendTypingIndicator(threadID uuid.UUID, senderID int64, participants []int64, isTyping bool) {
	wsMessage := &models.WSMessage{
		Type: models.WSTypeTyping,
		Payload: models.WSTypingPayload{
			ThreadID: threadID,
			UserID:   senderID,
			IsTyping: isTyping,
		},
	}

	// Send to other participants only
	otherParticipants := make([]int64, 0)
	for _, p := range participants {
		if p != senderID {
			otherParticipants = append(otherParticipants, p)
		}
	}

	h.SendToUsers(otherParticipants, wsMessage)
}

// SendReadReceipt broadcasts a read receipt
func (h *Hub) SendReadReceipt(threadID, messageID uuid.UUID, readerID int64, participants []int64) {
	wsMessage := &models.WSMessage{
		Type: models.WSTypeRead,
		Payload: models.WSReadPayload{
			ThreadID:  threadID,
			MessageID: messageID,
			UserID:    readerID,
			ReadAt:    time.Now(),
		},
	}

	// Send to other participants only
	otherParticipants := make([]int64, 0)
	for _, p := range participants {
		if p != readerID {
			otherParticipants = append(otherParticipants, p)
		}
	}

	h.SendToUsers(otherParticipants, wsMessage)
}

// SendNotification sends a notification to a user
func (h *Hub) SendNotification(userID int64, notification *models.Notification) {
	wsMessage := &models.WSMessage{
		Type:    models.WSTypeNotification,
		Payload: notification,
	}

	h.SendToUser(userID, wsMessage)
}

// handleRedisPubSub processes Redis pub/sub messages
func (h *Hub) handleRedisPubSub(pubsub *goredis.PubSub) {
	ch := pubsub.Channel()

	for msg := range ch {
		switch {
		case msg.Channel == "presence":
			var presence models.WSPresencePayload
			if err := json.Unmarshal([]byte(msg.Payload), &presence); err != nil {
				log.Printf("Failed to unmarshal presence update: %v", err)
				continue
			}

			// Broadcast presence update to all connected clients
			wsMessage := &models.WSMessage{
				Type:    models.WSTypePresence,
				Payload: presence,
			}

			h.mu.RLock()
			allUsers := make([]int64, 0, len(h.clients))
			for userID := range h.clients {
				allUsers = append(allUsers, userID)
			}
			h.mu.RUnlock()

			h.SendToUsers(allUsers, wsMessage)

		default:
			// Handle notification channels
			if len(msg.Channel) > 14 && msg.Channel[:14] == "notifications:" {
				var notification models.Notification
				if err := json.Unmarshal([]byte(msg.Payload), &notification); err != nil {
					log.Printf("Failed to unmarshal notification: %v", err)
					continue
				}

				h.SendNotification(notification.UserID, &notification)
			}
		}
	}
}

// IsUserOnline checks if a user has active WebSocket connections
func (h *Hub) IsUserOnline(userID int64) bool {
	h.mu.RLock()
	defer h.mu.RUnlock()
	_, exists := h.clients[userID]
	return exists
}

// GetOnlineUserIDs returns all currently connected user IDs
func (h *Hub) GetOnlineUserIDs() []int64 {
	h.mu.RLock()
	defer h.mu.RUnlock()

	userIDs := make([]int64, 0, len(h.clients))
	for userID := range h.clients {
		userIDs = append(userIDs, userID)
	}
	return userIDs
}
