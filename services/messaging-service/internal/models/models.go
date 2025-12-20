package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// Thread represents a message thread between users
type Thread struct {
	ID            uuid.UUID      `json:"id" db:"id"`
	Participants  []int64        `json:"participants" db:"participants"`
	JobID         sql.NullInt64  `json:"jobId,omitempty" db:"job_id"`
	Title         sql.NullString `json:"title,omitempty" db:"title"`
	LastMessageAt time.Time      `json:"lastMessageAt" db:"last_message_at"`
	CreatedAt     time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time      `json:"updatedAt" db:"updated_at"`
}

// ThreadWithDetails includes additional thread information
type ThreadWithDetails struct {
	Thread
	LastMessage *Message           `json:"lastMessage,omitempty"`
	UnreadCount int                `json:"unreadCount"`
	OtherUser   *ThreadParticipant `json:"otherUser,omitempty"`
}

// ThreadParticipant represents a user in a thread
type ThreadParticipant struct {
	UserID    int64  `json:"userId"`
	Username  string `json:"username"`
	FullName  string `json:"fullName"`
	AvatarURL string `json:"avatarUrl,omitempty"`
	IsOnline  bool   `json:"isOnline"`
}

// Message represents a chat message
type Message struct {
	ID          uuid.UUID    `json:"id" db:"id"`
	ThreadID    uuid.UUID    `json:"threadId" db:"thread_id"`
	SenderID    int64        `json:"senderId" db:"sender_id"`
	ReceiverID  int64        `json:"receiverId" db:"receiver_id"`
	Body        string       `json:"body" db:"body"`
	Attachments []Attachment `json:"attachments,omitempty" db:"attachments"`
	ReadAt      sql.NullTime `json:"readAt,omitempty" db:"read_at"`
	CreatedAt   time.Time    `json:"createdAt" db:"created_at"`
}

// MessageWithSender includes sender information
type MessageWithSender struct {
	Message
	SenderName   string `json:"senderName"`
	SenderAvatar string `json:"senderAvatar,omitempty"`
}

// Attachment represents a file attachment in a message
type Attachment struct {
	ID       string `json:"id"`
	Filename string `json:"filename"`
	URL      string `json:"url"`
	Type     string `json:"type"`
	Size     int64  `json:"size"`
}

// Notification represents a user notification
type Notification struct {
	ID        int64          `json:"id" db:"id"`
	UserID    int64          `json:"userId" db:"user_id"`
	Type      string         `json:"type" db:"type"`
	Title     string         `json:"title" db:"title"`
	Message   string         `json:"message" db:"message"`
	Data      sql.NullString `json:"data,omitempty" db:"data"`
	IsRead    bool           `json:"isRead" db:"is_read"`
	ReadAt    sql.NullTime   `json:"readAt,omitempty" db:"read_at"`
	CreatedAt time.Time      `json:"createdAt" db:"created_at"`
}

// PresenceInfo represents user presence status
type PresenceInfo struct {
	UserID     int64     `json:"userId"`
	IsOnline   bool      `json:"isOnline"`
	LastSeenAt time.Time `json:"lastSeenAt"`
	Status     string    `json:"status,omitempty"` // available, busy, away
}

// WebSocket message types
type WSMessageType string

const (
	WSTypeMessage      WSMessageType = "message"
	WSTypeTyping       WSMessageType = "typing"
	WSTypeRead         WSMessageType = "read"
	WSTypePresence     WSMessageType = "presence"
	WSTypeNotification WSMessageType = "notification"
	WSTypeError        WSMessageType = "error"
	WSTypePing         WSMessageType = "ping"
	WSTypePong         WSMessageType = "pong"
)

// WSMessage represents a WebSocket message
type WSMessage struct {
	Type    WSMessageType `json:"type"`
	Payload interface{}   `json:"payload"`
}

// WSTypingPayload represents typing indicator data
type WSTypingPayload struct {
	ThreadID uuid.UUID `json:"threadId"`
	UserID   int64     `json:"userId"`
	IsTyping bool      `json:"isTyping"`
}

// WSReadPayload represents message read receipt data
type WSReadPayload struct {
	ThreadID  uuid.UUID `json:"threadId"`
	MessageID uuid.UUID `json:"messageId"`
	UserID    int64     `json:"userId"`
	ReadAt    time.Time `json:"readAt"`
}

// WSPresencePayload represents presence update data
type WSPresencePayload struct {
	UserID   int64  `json:"userId"`
	IsOnline bool   `json:"isOnline"`
	Status   string `json:"status,omitempty"`
}

// CreateThreadRequest represents a request to create a thread
type CreateThreadRequest struct {
	ParticipantID  int64  `json:"participantId" binding:"required"`
	JobID          *int64 `json:"jobId,omitempty"`
	Title          string `json:"title,omitempty"`
	InitialMessage string `json:"initialMessage,omitempty"`
}

// SendMessageRequest represents a request to send a message
type SendMessageRequest struct {
	Body        string       `json:"body" binding:"required"`
	Attachments []Attachment `json:"attachments,omitempty"`
}
