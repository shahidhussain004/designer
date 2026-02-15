package db

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/designer/messaging-service/internal/models"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

// PostgresDB wraps the database connection
type PostgresDB struct {
	*sql.DB
}

// NewPostgresConnection creates a new database connection
func NewPostgresConnection(databaseURL string) (*PostgresDB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verify connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &PostgresDB{db}, nil
}

// RunMigrations applies database migrations for the messaging service
// NOTE: Message tables are now managed by marketplace-service Flyway migrations (V12)
// This function is kept for compatibility but is mostly a no-op
func RunMigrations(db *PostgresDB) error {
	// Check if message_threads table already exists (created by marketplace-service Flyway)
	var tableExists bool
	err := db.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM information_schema.tables 
			WHERE table_name = 'message_threads'
		)
	`).Scan(&tableExists)

	if err != nil {
		return fmt.Errorf("failed to check if message_threads table exists: %w", err)
	}

	if !tableExists {
		// This should not happen in normal operation since marketplace-service Flyway runs first
		return fmt.Errorf("message_threads table does not exist; ensure marketplace-service migrations have run first")
	}

	// Table already exists (created by Flyway), no additional migrations needed
	return nil
}

// CreateThread creates a new message thread
func (db *PostgresDB) CreateThread(ctx context.Context, participants []int64, jobID *int64, title string) (*models.Thread, error) {
	thread := &models.Thread{
		ID:            uuid.New(),
		Participants:  participants,
		LastMessageAt: time.Now(),
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if jobID != nil {
		thread.JobID = sql.NullInt64{Int64: *jobID, Valid: true}
	}
	if title != "" {
		thread.Title = sql.NullString{String: title, Valid: true}
	}

	query := `
		INSERT INTO message_threads (id, participants, job_id, title, last_message_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id`

	err := db.QueryRowContext(ctx, query,
		thread.ID,
		thread.Participants,
		thread.JobID,
		thread.Title,
		thread.LastMessageAt,
		thread.CreatedAt,
		thread.UpdatedAt,
	).Scan(&thread.ID)

	if err != nil {
		return nil, fmt.Errorf("failed to create thread: %w", err)
	}

	return thread, nil
}

// GetThreadByParticipants finds an existing thread between users
func (db *PostgresDB) GetThreadByParticipants(ctx context.Context, user1, user2 int64) (*models.Thread, error) {
	query := `
		SELECT id, participants, job_id, title, last_message_at, created_at, updated_at
		FROM message_threads
		WHERE participants @> ARRAY[$1, $2]::BIGINT[]
		AND cardinality(participants) = 2
		LIMIT 1`

	thread := &models.Thread{}
	err := db.QueryRowContext(ctx, query, user1, user2).Scan(
		&thread.ID,
		&thread.Participants,
		&thread.JobID,
		&thread.Title,
		&thread.LastMessageAt,
		&thread.CreatedAt,
		&thread.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get thread: %w", err)
	}

	return thread, nil
}

// GetThreadsByUser retrieves all threads for a user
func (db *PostgresDB) GetThreadsByUser(ctx context.Context, userID int64, limit, offset int) ([]models.ThreadWithDetails, error) {
	query := `
		SELECT 
			t.id, t.participants, t.job_id, t.title, t.last_message_at, t.created_at, t.updated_at,
			m.id as msg_id, m.body as msg_body, m.sender_id as msg_sender, m.created_at as msg_created,
			(SELECT COUNT(*) FROM messages WHERE thread_id = t.id AND receiver_id = $1 AND read_at IS NULL) as unread_count
		FROM message_threads t
		LEFT JOIN LATERAL (
			SELECT id, body, sender_id, created_at
			FROM messages
			WHERE thread_id = t.id
			ORDER BY created_at DESC
			LIMIT 1
		) m ON true
		WHERE $1 = ANY(t.participants)
		ORDER BY t.last_message_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := db.QueryContext(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get threads: %w", err)
	}
	defer rows.Close()

	var threads []models.ThreadWithDetails
	for rows.Next() {
		var thread models.ThreadWithDetails
		var msgID sql.NullString
		var msgBody sql.NullString
		var msgSender sql.NullInt64
		var msgCreated sql.NullTime

		err := rows.Scan(
			&thread.ID,
			&thread.Participants,
			&thread.JobID,
			&thread.Title,
			&thread.LastMessageAt,
			&thread.CreatedAt,
			&thread.UpdatedAt,
			&msgID,
			&msgBody,
			&msgSender,
			&msgCreated,
			&thread.UnreadCount,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan thread: %w", err)
		}

		if msgID.Valid {
			parsedID, _ := uuid.Parse(msgID.String)
			thread.LastMessage = &models.Message{
				ID:        parsedID,
				Body:      msgBody.String,
				SenderID:  msgSender.Int64,
				CreatedAt: msgCreated.Time,
			}
		}

		threads = append(threads, thread)
	}

	return threads, nil
}

// GetThread retrieves a thread by ID
func (db *PostgresDB) GetThread(ctx context.Context, threadID uuid.UUID) (*models.Thread, error) {
	query := `
		SELECT id, participants, job_id, title, last_message_at, created_at, updated_at
		FROM message_threads
		WHERE id = $1`

	thread := &models.Thread{}
	err := db.QueryRowContext(ctx, query, threadID).Scan(
		&thread.ID,
		&thread.Participants,
		&thread.JobID,
		&thread.Title,
		&thread.LastMessageAt,
		&thread.CreatedAt,
		&thread.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get thread: %w", err)
	}

	return thread, nil
}

// CreateMessage creates a new message
func (db *PostgresDB) CreateMessage(ctx context.Context, msg *models.Message) error {
	attachmentsJSON, _ := json.Marshal(msg.Attachments)

	query := `
		INSERT INTO messages (id, thread_id, sender_id, receiver_id, body, attachments, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`

	_, err := db.ExecContext(ctx, query,
		msg.ID,
		msg.ThreadID,
		msg.SenderID,
		msg.ReceiverID,
		msg.Body,
		attachmentsJSON,
		msg.CreatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create message: %w", err)
	}

	// Update thread's last_message_at
	updateQuery := `UPDATE message_threads SET last_message_at = $1, updated_at = $1 WHERE id = $2`
	_, err = db.ExecContext(ctx, updateQuery, msg.CreatedAt, msg.ThreadID)
	if err != nil {
		return fmt.Errorf("failed to update thread: %w", err)
	}

	return nil
}

// GetMessages retrieves messages from a thread
func (db *PostgresDB) GetMessages(ctx context.Context, threadID uuid.UUID, limit, offset int) ([]models.MessageWithSender, error) {
	query := `
		SELECT 
			m.id, m.thread_id, m.sender_id, m.receiver_id, m.body, m.attachments, m.read_at, m.created_at,
			u.full_name, u.profile_image_url
		FROM messages m
		JOIN users u ON m.sender_id = u.id
		WHERE m.thread_id = $1
		ORDER BY m.created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := db.QueryContext(ctx, query, threadID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get messages: %w", err)
	}
	defer rows.Close()

	var messages []models.MessageWithSender
	for rows.Next() {
		var msg models.MessageWithSender
		var attachmentsJSON []byte
		var senderAvatar sql.NullString

		err := rows.Scan(
			&msg.ID,
			&msg.ThreadID,
			&msg.SenderID,
			&msg.ReceiverID,
			&msg.Body,
			&attachmentsJSON,
			&msg.ReadAt,
			&msg.CreatedAt,
			&msg.SenderName,
			&senderAvatar,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan message: %w", err)
		}

		if senderAvatar.Valid {
			msg.SenderAvatar = senderAvatar.String
		}

		if err := json.Unmarshal(attachmentsJSON, &msg.Attachments); err != nil {
			// If attachments can't be parsed, log and continue with empty attachments
			msg.Attachments = nil
		}
		messages = append(messages, msg)
	}

	return messages, nil
}

// MarkMessageRead marks a message as read
func (db *PostgresDB) MarkMessageRead(ctx context.Context, messageID uuid.UUID, userID int64) error {
	query := `
		UPDATE messages 
		SET read_at = CURRENT_TIMESTAMP 
		WHERE id = $1 AND receiver_id = $2 AND read_at IS NULL`

	_, err := db.ExecContext(ctx, query, messageID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark message read: %w", err)
	}

	return nil
}

// MarkThreadMessagesRead marks all unread messages in a thread as read
func (db *PostgresDB) MarkThreadMessagesRead(ctx context.Context, threadID uuid.UUID, userID int64) error {
	query := `
		UPDATE messages 
		SET read_at = CURRENT_TIMESTAMP 
		WHERE thread_id = $1 AND receiver_id = $2 AND read_at IS NULL`

	_, err := db.ExecContext(ctx, query, threadID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark messages read: %w", err)
	}

	return nil
}

// GetNotifications retrieves notifications for a user
func (db *PostgresDB) GetNotifications(ctx context.Context, userID int64, limit, offset int) ([]models.Notification, error) {
	query := `
		SELECT id, user_id, type, title, message, data, is_read, read_at, created_at
		FROM notifications
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := db.QueryContext(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get notifications: %w", err)
	}
	defer rows.Close()

	var notifications []models.Notification
	for rows.Next() {
		var n models.Notification
		err := rows.Scan(
			&n.ID,
			&n.UserID,
			&n.Type,
			&n.Title,
			&n.Message,
			&n.Data,
			&n.IsRead,
			&n.ReadAt,
			&n.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan notification: %w", err)
		}
		notifications = append(notifications, n)
	}

	return notifications, nil
}

// MarkNotificationRead marks a notification as read
func (db *PostgresDB) MarkNotificationRead(ctx context.Context, notificationID, userID int64) error {
	query := `
		UPDATE notifications 
		SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
		WHERE id = $1 AND user_id = $2`

	_, err := db.ExecContext(ctx, query, notificationID, userID)
	if err != nil {
		return fmt.Errorf("failed to mark notification read: %w", err)
	}

	return nil
}

// MarkAllNotificationsRead marks all notifications as read for a user
func (db *PostgresDB) MarkAllNotificationsRead(ctx context.Context, userID int64) error {
	query := `
		UPDATE notifications 
		SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
		WHERE user_id = $1 AND is_read = FALSE`

	_, err := db.ExecContext(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("failed to mark all notifications read: %w", err)
	}

	return nil
}

// CreateNotification creates a new notification
func (db *PostgresDB) CreateNotification(ctx context.Context, notification *models.Notification) error {
	query := `
		INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at)
		VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP)
		RETURNING id, created_at`

	err := db.QueryRowContext(ctx, query,
		notification.UserID,
		notification.Type,
		notification.Title,
		notification.Message,
		notification.Data,
	).Scan(&notification.ID, &notification.CreatedAt)

	if err != nil {
		return fmt.Errorf("failed to create notification: %w", err)
	}

	return nil
}

// GetUserInfo retrieves basic user info
func (db *PostgresDB) GetUserInfo(ctx context.Context, userID int64) (*models.ThreadParticipant, error) {
	query := `
		SELECT id, username, full_name, profile_image_url
		FROM users
		WHERE id = $1`

	user := &models.ThreadParticipant{}
	var avatarURL sql.NullString

	err := db.QueryRowContext(ctx, query, userID).Scan(
		&user.UserID,
		&user.Username,
		&user.FullName,
		&avatarURL,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	if avatarURL.Valid {
		user.AvatarURL = avatarURL.String
	}

	return user, nil
}
