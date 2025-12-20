package websocket

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/designer/messaging-service/internal/models"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer
	maxMessageSize = 65536
)

// Client represents a WebSocket client connection
type Client struct {
	hub *Hub

	// User ID
	UserID int64

	// The WebSocket connection
	conn *websocket.Conn

	// Buffered channel of outbound messages
	send chan []byte
}

// NewClient creates a new WebSocket client
func NewClient(hub *Hub, conn *websocket.Conn, userID int64) *Client {
	return &Client{
		hub:    hub,
		conn:   conn,
		UserID: userID,
		send:   make(chan []byte, 256),
	}
}

// ReadPump pumps messages from the WebSocket connection to the hub
func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		log.Printf("Failed to set read deadline: %v", err)
	}
	c.conn.SetPongHandler(func(string) error {
		if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
			log.Printf("Failed to set read deadline in pong handler: %v", err)
		}
		// Refresh presence TTL on pong
		ctx := context.Background()
		if err := c.hub.redis.RefreshPresence(ctx, c.UserID); err != nil {
			log.Printf("Failed to refresh presence: %v", err)
		}
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}

		c.handleMessage(message)
	}
}

// WritePump pumps messages from the hub to the WebSocket connection
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeWait)); err != nil {
				log.Printf("Failed to set write deadline: %v", err)
				return
			}
			if !ok {
				// The hub closed the channel
				if err := c.conn.WriteMessage(websocket.CloseMessage, []byte{}); err != nil {
					log.Printf("Failed to write close message: %v", err)
				}
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			if _, err := w.Write(message); err != nil {
				log.Printf("Failed to write message: %v", err)
				return
			}

			// Add queued messages to the current WebSocket message
			n := len(c.send)
			for i := 0; i < n; i++ {
				if _, err := w.Write([]byte{'\n'}); err != nil {
					log.Printf("Failed to write newline: %v", err)
					w.Close()
					return
				}
				if _, err := w.Write(<-c.send); err != nil {
					log.Printf("Failed to write queued message: %v", err)
					w.Close()
					return
				}
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeWait)); err != nil {
				log.Printf("Failed to set write deadline: %v", err)
				return
			}
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleMessage processes incoming WebSocket messages
func (c *Client) handleMessage(data []byte) {
	var wsMessage models.WSMessage
	if err := json.Unmarshal(data, &wsMessage); err != nil {
		log.Printf("Failed to unmarshal message: %v", err)
		c.sendError("Invalid message format")
		return
	}

	switch wsMessage.Type {
	case models.WSTypePing:
		c.sendPong()

	case models.WSTypeTyping:
		c.handleTyping(wsMessage.Payload)

	case models.WSTypeRead:
		c.handleReadReceipt(wsMessage.Payload)

	case models.WSTypeMessage:
		c.handleChatMessage(wsMessage.Payload)

	default:
		c.sendError("Unknown message type")
	}
}

// handleTyping handles typing indicator messages
func (c *Client) handleTyping(payload interface{}) {
	data, _ := json.Marshal(payload)
	var typing models.WSTypingPayload
	if err := json.Unmarshal(data, &typing); err != nil {
		c.sendError("Invalid typing payload")
		return
	}

	ctx := context.Background()

	// Get thread participants
	thread, err := c.hub.db.GetThread(ctx, typing.ThreadID)
	if err != nil || thread == nil {
		c.sendError("Thread not found")
		return
	}

	// Update typing status in Redis
	if err := c.hub.redis.SetTyping(ctx, typing.ThreadID.String(), c.UserID, typing.IsTyping); err != nil {
		log.Printf("Failed to set typing in Redis: %v", err)
	}

	// Broadcast typing indicator
	c.hub.SendTypingIndicator(typing.ThreadID, c.UserID, thread.Participants, typing.IsTyping)
}

// handleReadReceipt handles read receipt messages
func (c *Client) handleReadReceipt(payload interface{}) {
	data, _ := json.Marshal(payload)
	var read models.WSReadPayload
	if err := json.Unmarshal(data, &read); err != nil {
		c.sendError("Invalid read receipt payload")
		return
	}

	ctx := context.Background()

	// Mark message as read in database
	if err := c.hub.db.MarkMessageRead(ctx, read.MessageID, c.UserID); err != nil {
		log.Printf("Failed to mark message read: %v", err)
		return
	}

	// Get thread participants
	thread, err := c.hub.db.GetThread(ctx, read.ThreadID)
	if err != nil || thread == nil {
		return
	}

	// Broadcast read receipt
	c.hub.SendReadReceipt(read.ThreadID, read.MessageID, c.UserID, thread.Participants)
}

// handleChatMessage handles incoming chat messages
func (c *Client) handleChatMessage(payload interface{}) {
	data, _ := json.Marshal(payload)
	var msgRequest struct {
		ThreadID uuid.UUID `json:"threadId"`
		Body     string    `json:"body"`
	}
	if err := json.Unmarshal(data, &msgRequest); err != nil {
		c.sendError("Invalid message payload")
		return
	}

	ctx := context.Background()

	// Get thread
	thread, err := c.hub.db.GetThread(ctx, msgRequest.ThreadID)
	if err != nil || thread == nil {
		c.sendError("Thread not found")
		return
	}

	// Verify user is a participant
	isParticipant := false
	var receiverID int64
	for _, p := range thread.Participants {
		if p == c.UserID {
			isParticipant = true
		} else {
			receiverID = p
		}
	}
	if !isParticipant {
		c.sendError("Not a thread participant")
		return
	}

	// Create message
	msg := &models.Message{
		ID:         uuid.New(),
		ThreadID:   msgRequest.ThreadID,
		SenderID:   c.UserID,
		ReceiverID: receiverID,
		Body:       msgRequest.Body,
		CreatedAt:  time.Now(),
	}

	// Send message through hub (persists and broadcasts)
	if err := c.hub.SendMessage(ctx, msg, thread.Participants); err != nil {
		c.sendError("Failed to send message")
		return
	}

	// Clear typing indicator
	if err := c.hub.redis.SetTyping(ctx, msgRequest.ThreadID.String(), c.UserID, false); err != nil {
		log.Printf("Failed to clear typing indicator: %v", err)
	}
}

// sendError sends an error message to the client
func (c *Client) sendError(message string) {
	errMsg := models.WSMessage{
		Type: models.WSTypeError,
		Payload: map[string]string{
			"error": message,
		},
	}
	data, _ := json.Marshal(errMsg)
	c.send <- data
}

// sendPong sends a pong response
func (c *Client) sendPong() {
	pongMsg := models.WSMessage{
		Type:    models.WSTypePong,
		Payload: time.Now().Unix(),
	}
	data, _ := json.Marshal(pongMsg)
	c.send <- data
}
