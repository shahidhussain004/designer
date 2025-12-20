package config

import (
	"os"
	"strings"
)

// Config holds all configuration for the messaging service
type Config struct {
	Port         string
	Environment  string
	DatabaseURL  string
	RedisURL     string
	KafkaBrokers []string
	KafkaGroupID string
	JWTSecret    string
}

// Load reads configuration from environment variables
func Load() *Config {
	return &Config{
		Port:         getEnv("PORT", "8081"),
		Environment:  getEnv("ENVIRONMENT", "development"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://marketplace_user:marketplace_pass_dev@localhost:5432/marketplace_db?sslmode=disable"),
		RedisURL:     getEnv("REDIS_URL", "redis://localhost:6379"),
		KafkaBrokers: getEnvSlice("KAFKA_BROKERS", []string{"localhost:9092"}),
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "messaging-service"),
		JWTSecret:    getEnv("JWT_SECRET", "your-256-bit-secret-change-this-in-production-please-make-it-secure"),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	if value, exists := os.LookupEnv(key); exists {
		return strings.Split(value, ",")
	}
	return defaultValue
}
