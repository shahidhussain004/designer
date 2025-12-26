# Multi-stage Dockerfile for Designer Marketplace Service
# Optimized for production with minimal image size and security best practices

# Build argument to determine if we're inside SEB network
ARG USE_SEB_ARTIFACTORY=true

# Stage 1: Build Stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

ARG USE_SEB_ARTIFACTORY

WORKDIR /app

# Configure Alpine repositories conditionally
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        export VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d '=' -f2 | cut -d '.' -f1,2 | tr -d '"') && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories && \
        echo '@edge https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/main' >> /etc/apk/repositories && \
        echo '@edgecommunity https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/community' >> /etc/apk/repositories && \
        echo '@testing https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/testing' >> /etc/apk/repositories; \
    fi

# Create Maven settings.xml for SEB Artifactory
RUN mkdir -p /tmp/.m2 && \
    if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        echo '<?xml version="1.0" encoding="UTF-8"?>' > /tmp/.m2/settings.xml && \
        echo '<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"' >> /tmp/.m2/settings.xml && \
        echo '          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' >> /tmp/.m2/settings.xml && \
        echo '          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">' >> /tmp/.m2/settings.xml && \
        echo '  <profiles>' >> /tmp/.m2/settings.xml && \
        echo '    <profile>' >> /tmp/.m2/settings.xml && \
        echo '      <id>seb-repos</id>' >> /tmp/.m2/settings.xml && \
        echo '      <repositories>' >> /tmp/.m2/settings.xml && \
        echo '        <repository>' >> /tmp/.m2/settings.xml && \
        echo '          <snapshots><enabled>false</enabled></snapshots>' >> /tmp/.m2/settings.xml && \
        echo '          <id>central</id>' >> /tmp/.m2/settings.xml && \
        echo '          <name>libs-release</name>' >> /tmp/.m2/settings.xml && \
        echo '          <url>https://repo7.sebank.se/artifactory/maven-apache</url>' >> /tmp/.m2/settings.xml && \
        echo '        </repository>' >> /tmp/.m2/settings.xml && \
        echo '        <repository>' >> /tmp/.m2/settings.xml && \
        echo '          <snapshots/>' >> /tmp/.m2/settings.xml && \
        echo '          <id>snapshots</id>' >> /tmp/.m2/settings.xml && \
        echo '          <name>libs-snapshot</name>' >> /tmp/.m2/settings.xml && \
        echo '          <url>https://repo7.sebank.se/artifactory/maven-org</url>' >> /tmp/.m2/settings.xml && \
        echo '        </repository>' >> /tmp/.m2/settings.xml && \
        echo '      </repositories>' >> /tmp/.m2/settings.xml && \
        echo '      <pluginRepositories>' >> /tmp/.m2/settings.xml && \
        echo '        <pluginRepository>' >> /tmp/.m2/settings.xml && \
        echo '          <snapshots><enabled>false</enabled></snapshots>' >> /tmp/.m2/settings.xml && \
        echo '          <id>central</id>' >> /tmp/.m2/settings.xml && \
        echo '          <name>plugins-release</name>' >> /tmp/.m2/settings.xml && \
        echo '          <url>https://repo7.sebank.se/artifactory/maven-apache</url>' >> /tmp/.m2/settings.xml && \
        echo '        </pluginRepository>' >> /tmp/.m2/settings.xml && \
        echo '        <pluginRepository>' >> /tmp/.m2/settings.xml && \
        echo '          <snapshots/>' >> /tmp/.m2/settings.xml && \
        echo '          <id>snapshots</id>' >> /tmp/.m2/settings.xml && \
        echo '          <name>plugins-snapshot</name>' >> /tmp/.m2/settings.xml && \
        echo '          <url>https://repo7.sebank.se/artifactory/maven-org</url>' >> /tmp/.m2/settings.xml && \
        echo '        </pluginRepository>' >> /tmp/.m2/settings.xml && \
        echo '      </pluginRepositories>' >> /tmp/.m2/settings.xml && \
        echo '    </profile>' >> /tmp/.m2/settings.xml && \
        echo '  </profiles>' >> /tmp/.m2/settings.xml && \
        echo '  <activeProfiles>' >> /tmp/.m2/settings.xml && \
        echo '    <activeProfile>seb-repos</activeProfile>' >> /tmp/.m2/settings.xml && \
        echo '  </activeProfiles>' >> /tmp/.m2/settings.xml && \
        echo '</settings>' >> /tmp/.m2/settings.xml; \
    else \
        echo '<?xml version="1.0" encoding="UTF-8"?><settings/>' > /tmp/.m2/settings.xml; \
    fi

# Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .

# Download dependencies with conditional Maven options
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        MAVEN_OPTS="-Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" \
        mvn dependency:resolve -B -s /tmp/.m2/settings.xml -Duser.home=/tmp || true; \
    else \
        mvn dependency:resolve -B -s /tmp/.m2/settings.xml -Duser.home=/tmp || true; \
    fi

# Copy source code and build
COPY src ./src
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        MAVEN_OPTS="-Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" \
        mvn --batch-mode --no-transfer-progress -Duser.home=/tmp -s /tmp/.m2/settings.xml package -Dmaven.test.skip -DskipITs=true; \
    else \
        mvn --batch-mode --no-transfer-progress -Duser.home=/tmp -s /tmp/.m2/settings.xml package -Dmaven.test.skip -DskipITs=true; \
    fi

# Stage 2: Runtime Stage
FROM eclipse-temurin:21-jre-alpine

ARG USE_SEB_ARTIFACTORY

# Configure Alpine repositories conditionally
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        export VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d '=' -f2 | cut -d '.' -f1,2 | tr -d '"') && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories; \
    fi

# Install wget (needed for health check)
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Copy certificates if they exist in the builder stage
RUN --mount=type=bind,from=builder,source=/app/src/main/resources-non-filtered/certs,target=/tmp/certs \
    cp /tmp/certs/*.jks ./ 2>/dev/null || echo "No certificate files found, skipping..."

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# Health check using actuator endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# JVM optimizations for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+ExitOnOutOfMemoryError \
    -Djava.security.egd=file:/dev/./urandom"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]