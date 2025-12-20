# Go Messaging Service

Real-time messaging service for the Designer Marketplace platform built with Go.

## Features

- **WebSocket Server**: Real-time bidirectional communication for chat
- **Redis Pub/Sub**: Presence tracking and cross-instance message broadcasting
- **PostgreSQL Persistence**: Durable message and thread storage
- **Kafka Consumer Integration**: Receives events for real-time notifications

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Go Messaging Service                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │  WebSocket  │   │   REST API  │   │   Kafka     │        │
│  │   Handler   │   │   Handlers  │   │  Consumer   │        │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘        │
│         │                 │                 │               │
│  ┌──────▼─────────────────▼─────────────────▼──────┐        │
│  │                    Hub                          │        │
│  │     (Connection & Message Management)           │        │
│  └──────┬─────────────────┬─────────────────┬──────┘        │
│         │                 │                 │               │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐        │
│  │ PostgreSQL  │   │    Redis    │   │   Kafka     │        │
│  │ (Messages)  │   │ (Presence)  │   │  (Events)   │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Go 1.21+
- PostgreSQL 15+
- Redis 7+
- Kafka (optional, for event streaming)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8081 | Server port |
| ENVIRONMENT | development | Environment mode |
| DATABASE_URL | postgres://... | PostgreSQL connection string |
| REDIS_URL | redis://localhost:6379 | Redis connection string |
| KAFKA_BROKERS | localhost:9092 | Kafka broker addresses |
| KAFKA_GROUP_ID | messaging-service | Kafka consumer group |
| JWT_SECRET | (required) | JWT signing secret |

## Installation

```bash
# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Run the service
go run main.go
```

## API Endpoints

### WebSocket

- `GET /api/v1/ws?token=<JWT>` - WebSocket connection

### Messages

- `GET /api/v1/messages/threads` - List message threads
- `GET /api/v1/messages/threads/:threadId` - Get thread details
- `GET /api/v1/messages/threads/:threadId/messages` - Get thread messages
- `POST /api/v1/messages/threads` - Create new thread
- `POST /api/v1/messages/threads/:threadId/messages` - Send message
- `PUT /api/v1/messages/:messageId/read` - Mark message as read

### Presence

- `GET /api/v1/presence/online` - Get online users
- `GET /api/v1/presence/user/:userId` - Get user presence

### Notifications

- `GET /api/v1/notifications` - Get notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all as read

## WebSocket Message Types

### Client → Server

```json
// Send message
{"type": "message", "payload": {"threadId": "uuid", "body": "Hello!"}}

// Typing indicator
{"type": "typing", "payload": {"threadId": "uuid", "isTyping": true}}

// Read receipt
{"type": "read", "payload": {"threadId": "uuid", "messageId": "uuid"}}

// Ping
{"type": "ping", "payload": null}
```

### Server → Client

```json
// New message
{"type": "message", "payload": {/* message object */}}

// Typing indicator
{"type": "typing", "payload": {"threadId": "uuid", "userId": 1, "isTyping": true}}

// Read receipt
{"type": "read", "payload": {"threadId": "uuid", "messageId": "uuid", "userId": 1}}

// Presence update
{"type": "presence", "payload": {"userId": 1, "isOnline": true}}

// Notification
{"type": "notification", "payload": {/* notification object */}}

// Pong
{"type": "pong", "payload": 1703012345}
```

## Kafka Topics Consumed

| Topic | Description |
|-------|-------------|
| jobs.posted | New job posted notification |
| jobs.updated | Job updated notification |
| jobs.deleted | Job deleted notification |
| payments.received | Payment received notification |
| payments.disputed | Payment dispute notification |
| proposals.submitted | New proposal notification |
| contracts.signed | Contract signed notification |
| courses.completed | Course completion notification |
| certificates.issued | Certificate issued notification |
| users.joined | New user welcome notification |

## Docker

```bash
# Build image
docker build -t messaging-service .

# Run container
docker run -p 8081:8081 --env-file .env messaging-service
```

## Development

```bash
# Run with hot reload (requires air)
air

# Run tests
go test ./...

# Build binary
go build -o messaging-service .
```

## Health Check

```bash
curl http://localhost:8081/health
```

Response:
```json
{
  "status": "healthy",
  "service": "messaging-service",
  "time": "2024-12-20T10:00:00Z"
}
```
