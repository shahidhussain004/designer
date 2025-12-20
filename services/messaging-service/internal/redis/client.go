package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/designer/messaging-service/internal/models"
	"github.com/go-redis/redis/v8"
)

const (
	presenceKeyPrefix   = "presence:"
	presenceTTL         = 5 * time.Minute
	typingKeyPrefix     = "typing:"
	typingTTL           = 3 * time.Second
	pubsubChannelPrefix = "chat:"
	presenceChannel     = "presence"
	notificationChannel = "notifications"
)

// Client wraps Redis client with messaging-specific methods
type Client struct {
	*redis.Client
	pubsub *redis.PubSub
}

// NewClient creates a new Redis client
func NewClient(redisURL string) (*Client, error) {
	var opt *redis.Options
	var err error

	// Check if URL has a scheme, if not treat as host:port
	if strings.HasPrefix(redisURL, "redis://") || strings.HasPrefix(redisURL, "rediss://") {
		opt, err = redis.ParseURL(redisURL)
		if err != nil {
			return nil, fmt.Errorf("failed to parse Redis URL: %w", err)
		}
	} else {
		// Treat as host:port
		opt = &redis.Options{
			Addr: redisURL,
		}
	}

	client := redis.NewClient(opt)

	// Verify connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping Redis: %w", err)
	}

	return &Client{Client: client}, nil
}

// SetUserOnline marks a user as online
func (c *Client) SetUserOnline(ctx context.Context, userID int64, status string) error {
	key := fmt.Sprintf("%s%d", presenceKeyPrefix, userID)

	presence := models.PresenceInfo{
		UserID:     userID,
		IsOnline:   true,
		LastSeenAt: time.Now(),
		Status:     status,
	}

	data, _ := json.Marshal(presence)
	return c.Set(ctx, key, data, presenceTTL).Err()
}

// SetUserOffline marks a user as offline
func (c *Client) SetUserOffline(ctx context.Context, userID int64) error {
	key := fmt.Sprintf("%s%d", presenceKeyPrefix, userID)

	// Store last seen time before deleting
	presence := models.PresenceInfo{
		UserID:     userID,
		IsOnline:   false,
		LastSeenAt: time.Now(),
		Status:     "offline",
	}

	data, _ := json.Marshal(presence)
	return c.Set(ctx, key, data, 24*time.Hour).Err() // Keep last seen for 24 hours
}

// RefreshPresence refreshes the TTL for a user's presence
func (c *Client) RefreshPresence(ctx context.Context, userID int64) error {
	key := fmt.Sprintf("%s%d", presenceKeyPrefix, userID)
	return c.Expire(ctx, key, presenceTTL).Err()
}

// GetUserPresence gets a user's presence information
func (c *Client) GetUserPresence(ctx context.Context, userID int64) (*models.PresenceInfo, error) {
	key := fmt.Sprintf("%s%d", presenceKeyPrefix, userID)

	data, err := c.Get(ctx, key).Bytes()
	if err == redis.Nil {
		return &models.PresenceInfo{
			UserID:   userID,
			IsOnline: false,
		}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get presence: %w", err)
	}

	var presence models.PresenceInfo
	if err := json.Unmarshal(data, &presence); err != nil {
		return nil, fmt.Errorf("failed to unmarshal presence: %w", err)
	}

	return &presence, nil
}

// GetOnlineUsers gets all currently online users
func (c *Client) GetOnlineUsers(ctx context.Context) ([]int64, error) {
	pattern := presenceKeyPrefix + "*"
	keys, err := c.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get presence keys: %w", err)
	}

	var onlineUsers []int64
	for _, key := range keys {
		data, err := c.Get(ctx, key).Bytes()
		if err != nil {
			continue
		}

		var presence models.PresenceInfo
		if err := json.Unmarshal(data, &presence); err != nil {
			continue
		}

		if presence.IsOnline {
			onlineUsers = append(onlineUsers, presence.UserID)
		}
	}

	return onlineUsers, nil
}

// SetTyping sets a user's typing indicator
func (c *Client) SetTyping(ctx context.Context, threadID string, userID int64, isTyping bool) error {
	key := fmt.Sprintf("%s%s:%d", typingKeyPrefix, threadID, userID)

	if isTyping {
		return c.Set(ctx, key, "1", typingTTL).Err()
	}
	return c.Del(ctx, key).Err()
}

// GetTypingUsers gets users currently typing in a thread
func (c *Client) GetTypingUsers(ctx context.Context, threadID string) ([]int64, error) {
	pattern := fmt.Sprintf("%s%s:*", typingKeyPrefix, threadID)
	keys, err := c.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get typing keys: %w", err)
	}

	var typingUsers []int64
	for _, key := range keys {
		// Extract user ID from key
		parts := strings.Split(key, ":")
		if len(parts) >= 3 {
			var userID int64
			fmt.Sscanf(parts[2], "%d", &userID)
			if userID > 0 {
				typingUsers = append(typingUsers, userID)
			}
		}
	}

	return typingUsers, nil
}

// PublishMessage publishes a message to a channel
func (c *Client) PublishMessage(ctx context.Context, channel string, message interface{}) error {
	data, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}
	return c.Publish(ctx, channel, data).Err()
}

// PublishPresenceUpdate publishes a presence update
func (c *Client) PublishPresenceUpdate(ctx context.Context, userID int64, isOnline bool) error {
	update := models.WSPresencePayload{
		UserID:   userID,
		IsOnline: isOnline,
	}
	return c.PublishMessage(ctx, presenceChannel, update)
}

// PublishNotification publishes a notification to a user
func (c *Client) PublishNotification(ctx context.Context, userID int64, notification *models.Notification) error {
	channel := fmt.Sprintf("%s:%d", notificationChannel, userID)
	return c.PublishMessage(ctx, channel, notification)
}

// SubscribeToChannels subscribes to multiple Redis channels
func (c *Client) SubscribeToChannels(ctx context.Context, channels ...string) *redis.PubSub {
	return c.Subscribe(ctx, channels...)
}

// GetChatChannel returns the chat channel name for a thread
func GetChatChannel(threadID string) string {
	return pubsubChannelPrefix + threadID
}

// GetUserNotificationChannel returns the notification channel for a user
func GetUserNotificationChannel(userID int64) string {
	return fmt.Sprintf("%s:%d", notificationChannel, userID)
}
