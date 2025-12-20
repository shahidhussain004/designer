#!/bin/bash

# Kafka Topics Creation Script for Designer Marketplace
# This script creates all required event topics for the platform

KAFKA_BROKER=${KAFKA_BROKER:-localhost:9092}
PARTITIONS=${PARTITIONS:-3}
REPLICATION_FACTOR=${REPLICATION_FACTOR:-1}

echo "Creating Kafka topics on $KAFKA_BROKER..."

# Define topics
TOPICS=(
    "jobs.posted"
    "jobs.updated"
    "jobs.deleted"
    "payments.received"
    "payments.disputed"
    "messages.sent"
    "users.joined"
    "proposals.submitted"
    "contracts.signed"
    "courses.completed"
    "certificates.issued"
)

# Create each topic
for topic in "${TOPICS[@]}"; do
    echo "Creating topic: $topic"
    kafka-topics --create \
        --bootstrap-server $KAFKA_BROKER \
        --topic $topic \
        --partitions $PARTITIONS \
        --replication-factor $REPLICATION_FACTOR \
        --if-not-exists
done

echo "Listing all topics:"
kafka-topics --list --bootstrap-server $KAFKA_BROKER

echo "Kafka topics setup complete!"
