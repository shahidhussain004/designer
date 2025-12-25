# Multi-stage Dockerfile for Designer Marketplace Service
# Optimized for production with minimal image size and security best practices

# Stage 1: Build Stage
FROM sebshift-io.repo7.sebank.se/library/maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Configure Alpine repositories to use SEB Artifactory
RUN export `grep VERSION_ID= /etc/os-release|cut -d '.' -f -2` && \
    env && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories && \
    echo '@edge https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/main' >> /etc/apk/repositories && \
    echo '@edgecommunity https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/community' >> /etc/apk/repositories && \
    echo '@testing https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/testing' >> /etc/apk/repositories

# Create Maven settings.xml with correct SEB Artifactory repositories
RUN mkdir -p /tmp/.m2 && \
    cat > /tmp/.m2/settings.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <profiles>
    <profile>
      <id>seb-repos</id>
      <repositories>
        <repository>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <id>central</id>
          <name>libs-release</name>
          <url>https://repo7.sebank.se/artifactory/maven-apache</url>
        </repository>
        <repository>
          <snapshots/>
          <id>snapshots</id>
          <name>libs-snapshot</name>
          <url>https://repo7.sebank.se/artifactory/maven-org</url>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <id>central</id>
          <name>plugins-release</name>
          <url>https://repo7.sebank.se/artifactory/maven-apache</url>
        </pluginRepository>
        <pluginRepository>
          <snapshots/>
          <id>snapshots</id>
          <name>plugins-snapshot</name>
          <url>https://repo7.sebank.se/artifactory/maven-org</url>
        </pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>seb-repos</activeProfile>
  </activeProfiles>
</settings>
EOF

# Disable SSL verification for Maven (for SEB internal network)
ENV MAVEN_OPTS="-Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true"

# Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .

# Try to download dependencies using the settings file
RUN mvn dependency:resolve -B -s /tmp/.m2/settings.xml -Duser.home=/tmp || true

# Copy source code and build
COPY src ./src
RUN mvn --batch-mode --no-transfer-progress -Duser.home=/tmp -s /tmp/.m2/settings.xml package -Dmaven.test.skip -DskipITs=true

# Stage 2: Runtime Stage
FROM sebshift-io.repo7.sebank.se/library/eclipse-temurin:21-jre-alpine

# Configure Alpine repositories to use SEB Artifactory
RUN export `grep VERSION_ID= /etc/os-release|cut -d '.' -f -2` && \
    env && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy the certificate file
COPY src/main/resources-non-filtered/certs/99k45-dev.sebank.se.jks .

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

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