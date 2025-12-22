# Build stage
FROM golang:1.21-alpine AS base

# Install build dependencies (including ca-certificates for SSL verification)
RUN apk add --no-cache git ca-certificates tzdata build-base

WORKDIR /app

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./

# Download dependencies explicitly in separate layer
RUN go mod download

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o messaging-service \
    .

# Runtime stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1000 appgroup && \
    adduser -D -u 1000 -G appgroup appuser

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/messaging-service ./messaging-service

# Change ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8081

CMD ["./messaging-service"]
