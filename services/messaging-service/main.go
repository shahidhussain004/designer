package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/designer/messaging-service/internal/config"
	"github.com/designer/messaging-service/internal/db"
	"github.com/designer/messaging-service/internal/handlers"
	"github.com/designer/messaging-service/internal/kafka"
	"github.com/designer/messaging-service/internal/middleware"
	"github.com/designer/messaging-service/internal/redis"
	"github.com/designer/messaging-service/internal/websocket"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database connection
	database, err := db.NewPostgresConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run database migrations
	if err := db.RunMigrations(database); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize Redis client
	redisClient, err := redis.NewClient(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	defer redisClient.Close()

	// Initialize WebSocket hub
	hub := websocket.NewHub(redisClient, database)
	go hub.Run()

	// Initialize Kafka consumer
	kafkaConsumer, err := kafka.NewConsumer(cfg.KafkaBrokers, cfg.KafkaGroupID, hub)
	if err != nil {
		log.Fatalf("Failed to create Kafka consumer: %v", err)
	}

	// Start Kafka consumer in background
	ctx, cancel := context.WithCancel(context.Background())
	go kafkaConsumer.Start(ctx)

	// Initialize Gin router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()

	// Add middleware
	router.Use(middleware.CORS())
	router.Use(middleware.RequestLogger())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "messaging-service",
			"time":    time.Now().UTC(),
		})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		// Public routes
		api.GET("/ws", handlers.HandleWebSocket(hub, cfg.JWTSecret))

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.JWTAuth(cfg.JWTSecret))
		{
			// Message endpoints
			messages := protected.Group("/messages")
			{
				messages.GET("/threads", handlers.GetThreads(database))
				messages.GET("/threads/:threadId", handlers.GetThread(database))
				messages.GET("/threads/:threadId/messages", handlers.GetMessages(database))
				messages.POST("/threads", handlers.CreateThread(database, hub))
				messages.POST("/threads/:threadId/messages", handlers.SendMessage(database, hub))
				messages.PUT("/messages/:messageId/read", handlers.MarkMessageRead(database))
			}

			// Presence endpoints
			presence := protected.Group("/presence")
			{
				presence.GET("/online", handlers.GetOnlineUsers(redisClient))
				presence.GET("/user/:userId", handlers.GetUserPresence(redisClient))
			}

			// Notification endpoints
			notifications := protected.Group("/notifications")
			{
				notifications.GET("/", handlers.GetNotifications(database))
				notifications.PUT("/:id/read", handlers.MarkNotificationRead(database))
				notifications.PUT("/read-all", handlers.MarkAllNotificationsRead(database))
			}
		}
	}

	// Metrics endpoint
	router.GET("/metrics", handlers.MetricsHandler())

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("Messaging service starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down messaging service...")

	// Cancel Kafka consumer
	cancel()

	// Shutdown HTTP server with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Messaging service stopped")
}
