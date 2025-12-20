package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/designer/messaging-service/internal/models"
	"github.com/designer/messaging-service/internal/websocket"
	"github.com/segmentio/kafka-go"
)

// Event topics consumed by the messaging service
var consumedTopics = []string{
	"jobs.posted",
	"jobs.updated",
	"jobs.deleted",
	"payments.received",
	"payments.disputed",
	"proposals.submitted",
	"contracts.signed",
	"courses.completed",
	"certificates.issued",
	"users.joined",
}

// Consumer handles Kafka message consumption
type Consumer struct {
	readers []*kafka.Reader
	hub     *websocket.Hub
}

// EventMessage represents a Kafka event message
type EventMessage struct {
	EventType string          `json:"eventType"`
	Timestamp time.Time       `json:"timestamp"`
	UserID    int64           `json:"userId,omitempty"`
	Data      json.RawMessage `json:"data"`
}

// JobEvent represents a job-related event
type JobEvent struct {
	JobID      int64   `json:"jobId"`
	Title      string  `json:"title"`
	ClientID   int64   `json:"clientId"`
	ClientName string  `json:"clientName"`
	Category   string  `json:"category,omitempty"`
	Budget     float64 `json:"budget,omitempty"`
	Status     string  `json:"status,omitempty"`
}

// PaymentEvent represents a payment-related event
type PaymentEvent struct {
	PaymentID  string  `json:"paymentId"`
	Amount     float64 `json:"amount"`
	Currency   string  `json:"currency"`
	Status     string  `json:"status"`
	FromUserID int64   `json:"fromUserId"`
	ToUserID   int64   `json:"toUserId"`
	JobID      int64   `json:"jobId,omitempty"`
}

// ProposalEvent represents a proposal-related event
type ProposalEvent struct {
	ProposalID     int64   `json:"proposalId"`
	JobID          int64   `json:"jobId"`
	JobTitle       string  `json:"jobTitle"`
	FreelancerID   int64   `json:"freelancerId"`
	FreelancerName string  `json:"freelancerName"`
	ClientID       int64   `json:"clientId"`
	ProposedRate   float64 `json:"proposedRate"`
}

// ContractEvent represents a contract-related event
type ContractEvent struct {
	ContractID   int64   `json:"contractId"`
	JobID        int64   `json:"jobId"`
	JobTitle     string  `json:"jobTitle"`
	ClientID     int64   `json:"clientId"`
	FreelancerID int64   `json:"freelancerId"`
	Amount       float64 `json:"amount"`
}

// CourseEvent represents a course-related event
type CourseEvent struct {
	CourseID    string    `json:"courseId"`
	CourseTitle string    `json:"courseTitle"`
	UserID      int64     `json:"userId"`
	UserName    string    `json:"userName"`
	CompletedAt time.Time `json:"completedAt,omitempty"`
}

// CertificateEvent represents a certificate-related event
type CertificateEvent struct {
	CertificateID string    `json:"certificateId"`
	CourseID      string    `json:"courseId"`
	CourseTitle   string    `json:"courseTitle"`
	UserID        int64     `json:"userId"`
	UserName      string    `json:"userName"`
	IssuedAt      time.Time `json:"issuedAt"`
}

// UserEvent represents a user-related event
type UserEvent struct {
	UserID   int64  `json:"userId"`
	Username string `json:"username"`
	FullName string `json:"fullName"`
	Role     string `json:"role"`
	Email    string `json:"email"`
}

// NewConsumer creates a new Kafka consumer
func NewConsumer(brokers []string, groupID string, hub *websocket.Hub) (*Consumer, error) {
	var readers []*kafka.Reader

	for _, topic := range consumedTopics {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers:        brokers,
			Topic:          topic,
			GroupID:        groupID,
			MinBytes:       10e3, // 10KB
			MaxBytes:       10e6, // 10MB
			MaxWait:        time.Second,
			StartOffset:    kafka.LastOffset,
			CommitInterval: time.Second,
		})
		readers = append(readers, reader)
	}

	return &Consumer{
		readers: readers,
		hub:     hub,
	}, nil
}

// Start begins consuming messages from all topics
func (c *Consumer) Start(ctx context.Context) {
	for _, reader := range c.readers {
		go c.consumeTopic(ctx, reader)
	}
}

// consumeTopic consumes messages from a single topic
func (c *Consumer) consumeTopic(ctx context.Context, reader *kafka.Reader) {
	log.Printf("Starting consumer for topic: %s", reader.Config().Topic)

	for {
		select {
		case <-ctx.Done():
			reader.Close()
			return
		default:
			msg, err := reader.FetchMessage(ctx)
			if err != nil {
				if ctx.Err() != nil {
					return
				}
				log.Printf("Error fetching message from %s: %v", reader.Config().Topic, err)
				time.Sleep(time.Second)
				continue
			}

			c.processMessage(msg)

			if err := reader.CommitMessages(ctx, msg); err != nil {
				log.Printf("Error committing message: %v", err)
			}
		}
	}
}

// processMessage handles a single Kafka message
func (c *Consumer) processMessage(msg kafka.Message) {
	var event EventMessage
	if err := json.Unmarshal(msg.Value, &event); err != nil {
		log.Printf("Error unmarshaling message from %s: %v", msg.Topic, err)
		return
	}

	log.Printf("Processing event from %s: %s", msg.Topic, event.EventType)

	switch msg.Topic {
	case "jobs.posted":
		c.handleJobPosted(event)
	case "jobs.updated":
		c.handleJobUpdated(event)
	case "jobs.deleted":
		c.handleJobDeleted(event)
	case "payments.received":
		c.handlePaymentReceived(event)
	case "payments.disputed":
		c.handlePaymentDisputed(event)
	case "proposals.submitted":
		c.handleProposalSubmitted(event)
	case "contracts.signed":
		c.handleContractSigned(event)
	case "courses.completed":
		c.handleCourseCompleted(event)
	case "certificates.issued":
		c.handleCertificateIssued(event)
	case "users.joined":
		c.handleUserJoined(event)
	}
}

// handleJobPosted sends notifications when a new job is posted
func (c *Consumer) handleJobPosted(event EventMessage) {
	var job JobEvent
	if err := json.Unmarshal(event.Data, &job); err != nil {
		log.Printf("Error parsing job event: %v", err)
		return
	}

	// Broadcast to all online freelancers (they'll filter client-side by skills)
	notification := &models.Notification{
		Type:    "job_posted",
		Title:   "New Job Available",
		Message: job.Title,
	}

	// Get all online users and notify them
	onlineUsers := c.hub.GetOnlineUserIDs()
	for _, userID := range onlineUsers {
		notification.UserID = userID
		c.hub.SendNotification(userID, notification)
	}
}

// handleJobUpdated sends notifications when a job is updated
func (c *Consumer) handleJobUpdated(event EventMessage) {
	var job JobEvent
	if err := json.Unmarshal(event.Data, &job); err != nil {
		return
	}

	// Notify job owner
	notification := &models.Notification{
		UserID:  job.ClientID,
		Type:    "job_updated",
		Title:   "Job Updated",
		Message: "Your job \"" + job.Title + "\" has been updated",
	}
	c.hub.SendNotification(job.ClientID, notification)
}

// handleJobDeleted sends notifications when a job is deleted
func (c *Consumer) handleJobDeleted(event EventMessage) {
	var job JobEvent
	if err := json.Unmarshal(event.Data, &job); err != nil {
		return
	}

	notification := &models.Notification{
		UserID:  job.ClientID,
		Type:    "job_deleted",
		Title:   "Job Deleted",
		Message: "Your job \"" + job.Title + "\" has been deleted",
	}
	c.hub.SendNotification(job.ClientID, notification)
}

// handlePaymentReceived sends notifications for successful payments
func (c *Consumer) handlePaymentReceived(event EventMessage) {
	var payment PaymentEvent
	if err := json.Unmarshal(event.Data, &payment); err != nil {
		return
	}

	// Notify recipient
	notification := &models.Notification{
		UserID:  payment.ToUserID,
		Type:    "payment_received",
		Title:   "Payment Received",
		Message: "You received a payment of $" + formatAmount(payment.Amount),
	}
	c.hub.SendNotification(payment.ToUserID, notification)

	// Notify sender
	notification = &models.Notification{
		UserID:  payment.FromUserID,
		Type:    "payment_sent",
		Title:   "Payment Sent",
		Message: "Your payment of $" + formatAmount(payment.Amount) + " was successful",
	}
	c.hub.SendNotification(payment.FromUserID, notification)
}

// handlePaymentDisputed sends notifications for payment disputes
func (c *Consumer) handlePaymentDisputed(event EventMessage) {
	var payment PaymentEvent
	if err := json.Unmarshal(event.Data, &payment); err != nil {
		return
	}

	// Notify both parties
	notification := &models.Notification{
		UserID:  payment.ToUserID,
		Type:    "payment_disputed",
		Title:   "Payment Disputed",
		Message: "A payment of $" + formatAmount(payment.Amount) + " has been disputed",
	}
	c.hub.SendNotification(payment.ToUserID, notification)

	notification.UserID = payment.FromUserID
	c.hub.SendNotification(payment.FromUserID, notification)
}

// handleProposalSubmitted sends notifications when a proposal is submitted
func (c *Consumer) handleProposalSubmitted(event EventMessage) {
	var proposal ProposalEvent
	if err := json.Unmarshal(event.Data, &proposal); err != nil {
		return
	}

	// Notify job owner
	notification := &models.Notification{
		UserID:  proposal.ClientID,
		Type:    "proposal_received",
		Title:   "New Proposal",
		Message: proposal.FreelancerName + " submitted a proposal for \"" + proposal.JobTitle + "\"",
	}
	c.hub.SendNotification(proposal.ClientID, notification)

	// Notify freelancer of confirmation
	notification = &models.Notification{
		UserID:  proposal.FreelancerID,
		Type:    "proposal_submitted",
		Title:   "Proposal Submitted",
		Message: "Your proposal for \"" + proposal.JobTitle + "\" has been submitted",
	}
	c.hub.SendNotification(proposal.FreelancerID, notification)
}

// handleContractSigned sends notifications when a contract is signed
func (c *Consumer) handleContractSigned(event EventMessage) {
	var contract ContractEvent
	if err := json.Unmarshal(event.Data, &contract); err != nil {
		return
	}

	// Notify freelancer
	notification := &models.Notification{
		UserID:  contract.FreelancerID,
		Type:    "contract_signed",
		Title:   "Contract Signed!",
		Message: "You've been hired for \"" + contract.JobTitle + "\"",
	}
	c.hub.SendNotification(contract.FreelancerID, notification)

	// Notify client
	notification = &models.Notification{
		UserID:  contract.ClientID,
		Type:    "contract_signed",
		Title:   "Contract Created",
		Message: "Contract for \"" + contract.JobTitle + "\" has been created",
	}
	c.hub.SendNotification(contract.ClientID, notification)
}

// handleCourseCompleted sends notifications when a course is completed
func (c *Consumer) handleCourseCompleted(event EventMessage) {
	var course CourseEvent
	if err := json.Unmarshal(event.Data, &course); err != nil {
		return
	}

	notification := &models.Notification{
		UserID:  course.UserID,
		Type:    "course_completed",
		Title:   "Course Completed!",
		Message: "Congratulations! You completed \"" + course.CourseTitle + "\"",
	}
	c.hub.SendNotification(course.UserID, notification)
}

// handleCertificateIssued sends notifications when a certificate is issued
func (c *Consumer) handleCertificateIssued(event EventMessage) {
	var cert CertificateEvent
	if err := json.Unmarshal(event.Data, &cert); err != nil {
		return
	}

	notification := &models.Notification{
		UserID:  cert.UserID,
		Type:    "certificate_issued",
		Title:   "Certificate Issued",
		Message: "Your certificate for \"" + cert.CourseTitle + "\" is ready!",
	}
	c.hub.SendNotification(cert.UserID, notification)
}

// handleUserJoined sends welcome notifications to new users
func (c *Consumer) handleUserJoined(event EventMessage) {
	var user UserEvent
	if err := json.Unmarshal(event.Data, &user); err != nil {
		return
	}

	notification := &models.Notification{
		UserID:  user.UserID,
		Type:    "welcome",
		Title:   "Welcome to Designer Marketplace!",
		Message: "Hello " + user.FullName + "! Start exploring jobs and opportunities.",
	}
	c.hub.SendNotification(user.UserID, notification)
}

// formatAmount formats a monetary amount
func formatAmount(amount float64) string {
	return fmt.Sprintf("%.2f", amount)
}

// Close closes all Kafka readers
func (c *Consumer) Close() error {
	for _, reader := range c.readers {
		if err := reader.Close(); err != nil {
			return err
		}
	}
	return nil
}
