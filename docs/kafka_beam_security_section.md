# Section 15: Event Streaming & Data Security

**To be inserted in marketplace_design.md between "scale from free to enterprise without code changes." and "## KPIs"**

---

## 15. Event Streaming & Data Security (Kafka, Apache Beam & Encryption)

### Part A: Apache Kafka - Event Streaming (Real Benefits)
#### Real Use Cases in This Project

1. **Event-Driven Microservices Communication**
   - Replace synchronous REST calls with async events
   - Services publish events, others subscribe (loose coupling)
   - Example: `job_posted` event consumed by matching service, notification service, analytics service

2. **Audit Log & Event Sourcing**
   - Track every state change (who did what, when)
   - Replay events to rebuild state
   - Essential for disputes, compliance, debugging

3. **Blog Feed Aggregation Pipeline**
   - External RSS feeds → Kafka topic → processing → MongoDB
   - Handle bursts of content without overwhelming services
   - Retry failed feeds automatically

4. **Real-time Analytics & Dashboards**
   - User activity streams → Kafka → analytics store
   - Track job views, proposal submissions, course completions
   - Feed Grafana dashboards in real-time

5. **Notification Fanout**
   - One event (`payment_received`) → multiple consumers (email, SMS, push, in-app)
   - Each consumer processes independently at its own pace

6. **Failed Payment Retry Queue**
   - Kafka guarantees message delivery
   - Automatic retry with backoff for failed Stripe payments

**Cost:** FREE (Apache Kafka is 100% open-source)

**Learning Curve:** Moderate (2-3 weeks to master basics)

#### Kafka Architecture in Your Stack

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Java      │      │     Go      │      │   .NET      │
│   Service   │─────▶│   Service   │─────▶│   Service   │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │ publish events     │ publish            │ publish
       ▼                    ▼                    ▼
  ┌────────────────────────────────────────────────┐
  │              Apache Kafka Cluster              │
  │                                                 │
  │  Topics:                                        │
  │  - jobs.posted                                  │
  │  - jobs.completed                               │
  │  - payments.received                            │
  │  - courses.enrolled                             │
  │  - feeds.aggregated                             │
  │  - notifications.outbox                         │
  └────────┬───────────────────────┬────────────────┘
           │                       │
           │ consume              │ consume
           ▼                       ▼
    ┌──────────────┐       ┌──────────────┐
    │  Matching    │       │ Notification │
    │  Consumer    │       │  Consumer    │
    └──────────────┘       └──────────────┘
```

#### Quick Start (Docker Compose)

Add to your docker-compose.yml:

```yaml
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8090:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
```

**Access Kafka UI:** http://localhost:8090

#### Key Kafka Topics for Your Platform

```
1. jobs.posted           - New job created
2. jobs.completed        - Job marked complete
3. proposals.submitted   - New proposal on job
4. proposals.accepted    - Proposal accepted (contract created)
5. payments.received     - Payment completed
6. payments.failed       - Payment failed (needs retry)
7. courses.enrolled      - User enrolled in course
8. courses.completed     - Course completion
9. feeds.fetched         - Blog feed item fetched
10. notifications.outbox - All outgoing notifications
11. analytics.events     - User activity tracking
```

**Producer Example (Java):**
```java
@Service
public class JobEventProducer {
    @Autowired
    private KafkaTemplate<String, JobPostedEvent> kafkaTemplate;
    
    public void publishJobPosted(Job job) {
        JobPostedEvent event = JobPostedEvent.from(job);
        kafkaTemplate.send("jobs.posted", job.getId(), event);
    }
}
```

**Consumer Example (Go):**
```go
reader := kafka.NewReader(kafka.ReaderConfig{
    Brokers:  []string{"localhost:9092"},
    Topic:    "jobs.posted",
    GroupID:  "matching-service",
})
defer reader.Close()

for {
    msg, _ := reader.ReadMessage(context.Background())
    // Process event
    processJobPosted(msg.Value)
}
```

---

### Part B: Apache Beam - Data Pipelines (Strategic Use Cases)

**Why Add Apache Beam:** Unified batch + streaming processing for complex data workflows

#### Real Use Cases in This Project

1. **Blog Feed Aggregation Pipeline**
   - Fetch 100+ RSS feeds concurrently
   - Parse, clean, extract metadata, deduplicate
   - Enrich with AI-generated tags
   - Store in MongoDB

2. **Matching Algorithm Training Pipeline**
   - Extract historical job-hire pairs from Postgres
   - Compute skill similarity scores
   - Generate training dataset
   - Train and deploy matching model

3. **Analytics & Reporting Pipeline**
   - Consume events from Kafka
   - Compute metrics (jobs/day, conversion rates)
   - Store in time-series DB for Grafana

4. **User Data Export (GDPR Compliance)**
   - Query Postgres, MongoDB, Redis
   - Merge user data from all services
   - Generate downloadable archive

**Cost:** FREE (Apache Beam is open-source)

**Learning Curve:** Steep (4-6 weeks) but valuable for data engineering

#### Example: Blog Feed Aggregation (Python)

```python
import apache_beam as beam

def run_feed_pipeline():
    feed_sources = ['https://...', 'https://...']  # 100+ feeds
    
    with beam.Pipeline() as pipeline:
        (
            pipeline
            | 'Create URLs' >> beam.Create(feed_sources)
            | 'Fetch Feeds' >> beam.ParDo(FetchFeed())
            | 'Deduplicate' >> beam.ParDo(DeduplicateByUrl())
            | 'Enrich Tags' >> beam.ParDo(EnrichWithTags())
            | 'Write MongoDB' >> beam.ParDo(WriteToMongo())
        )

# Schedule with cron every 6 hours
```

**Recommendation:** 
- Phase 2: Add Kafka for events
- Phase 4: Add Beam for analytics and feed aggregation

---

### Part C: Data Security & Encryption (Comprehensive Guide)

#### 🎯 RECOMMENDATION: Simplified MVP Approach (1-2 days setup)

**My Recommendation:** Start with **Essential Security Only** (MVP), add **Advanced Encryption Later**

**Why:** 
- Full encryption adds 5-7 days to Phase 1
- Migrating unencrypted data later is painful for payment/sensitive data
- But you can defer encryption of non-critical fields

**MVP Security (Essential - Start Now):**
```
✅ TLS/SSL everywhere (Let's Encrypt)         - 1 day
✅ Password hashing (bcrypt)                   - Already included
✅ JWT tokens (short expiration)               - Already included
✅ Stripe tokenization (Stripe handles encryption) - No work needed
✅ Input validation & SQL injection protection - Already included
✅ Basic rate limiting (Nginx)                 - Already included
```

**Time: 1-2 days total** (mostly TLS setup and testing)

**Advanced Encryption (Defer to Phase 3+ or When Revenue Starts):**
```
⏸️  Field-level encryption (pgcrypto, CSFLE)  - 3-4 days
⏸️  HashiCorp Vault key management            - 2-3 days
⏸️  Encrypted audit logs                      - 1-2 days
⏸️  Email/phone encryption                    - 1 day
```

**Critical Exception - DO encrypt these immediately:**
- Stripe customer IDs / payment tokens (but Stripe SDK handles most of this)
- Any SSN or Tax IDs (if you collect them)
- Bank account info (if storing)

**Bottom Line:**
- **Skip full encryption in Phase 1** ✅
- **Add TLS + bcrypt + Stripe tokenization only** ✅
- **Add field-level encryption in Phase 3** (after MVP is validated) ✅
- **No data migration pain** if you mark columns as "to be encrypted" from day 1

---

#### 1. Encryption at Rest (Database) - OPTIONAL for MVP, Add Later

**PostgreSQL - Field-Level Encryption**

```sql
-- Enable pgcrypto (built-in, free)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table with encrypted fields
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash BYTEA NOT NULL,  -- bcrypt
    ssn_encrypted BYTEA,           -- AES encrypted
    payment_info_encrypted BYTEA   -- AES encrypted
);

-- Insert with encryption
INSERT INTO users (id, email, password_hash, ssn_encrypted)
VALUES (
    gen_random_uuid(),
    'user@example.com',
    crypt('password', gen_salt('bf')),
    pgp_sym_encrypt('123-45-6789', current_setting('app.encryption_key'))
);

-- Query with decryption
SELECT 
    id, 
    email,
    pgp_sym_decrypt(ssn_encrypted, current_setting('app.encryption_key')) as ssn
FROM users;
```

**Java - Application-Level Encryption**

```java
@Entity
public class User {
    @Id
    private UUID id;
    
    @Convert(converter = SensitiveDataConverter.class)
    private String ssn;  // Automatically encrypted/decrypted
}

@Converter
public class SensitiveDataConverter implements AttributeConverter<String, byte[]> {
    @Autowired
    private AESEncryptor encryptor;
    
    @Override
    public byte[] convertToDatabaseColumn(String data) {
        return data != null ? encryptor.encrypt(data) : null;
    }
    
    @Override
    public String convertToEntityAttribute(byte[] dbData) {
        return dbData != null ? encryptor.decrypt(dbData) : null;
    }
}
```

**MongoDB - Client-Side Field Level Encryption (CSFLE)**

```csharp
// .NET MongoDB with automatic encryption
var kmsProviders = new Dictionary<string, IReadOnlyDictionary<string, object>>
{
    { "local", new Dictionary<string, object>
        {{ "key", Convert.FromBase64String(Environment.GetEnvironmentVariable("MONGO_KEY")) }}
    }
};

var autoEncryptionOptions = new AutoEncryptionOptions(
    keyVaultNamespace: "encryption.__keyVault",
    kmsProviders: kmsProviders
);

var clientSettings = MongoClientSettings.FromConnectionString("...");
clientSettings.AutoEncryptionOptions = autoEncryptionOptions;

var client = new MongoClient(clientSettings);
// All marked fields automatically encrypted/decrypted
```

#### 2. Encryption in Transit (TLS/SSL)

**Nginx - Force HTTPS with Let's Encrypt (Free)**

```nginx
server {
    listen 80;
    server_name api.marketplace.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.marketplace.com;
    
    ssl_certificate /etc/letsencrypt/live/api.marketplace.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.marketplace.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

**Install Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.marketplace.com
```

**Database Connections - Force TLS**

```properties
# Postgres
jdbc:postgresql://localhost:5432/marketplace?ssl=true&sslmode=require

# MongoDB Atlas (TLS enabled by default)
mongodb+srv://user:password@cluster.mongodb.net/marketplace?ssl=true
```

#### 3. Key Management (Free Options)

**Option A: HashiCorp Vault (Recommended)**

```bash
# Run Vault in Docker
docker run -d --cap-add=IPC_LOCK \
  -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' \
  -p 8200:8200 vault

# Store keys
vault kv put secret/marketplace/encryption \
  postgres_key="base64key..." \
  mongo_key="base64key..."
```

**Option B: Environment Variables (Simpler for MVP)**

```bash
# Generate strong keys
openssl rand -base64 32

# .env file (never commit)
POSTGRES_ENCRYPTION_KEY=base64key...
MONGO_ENCRYPTION_KEY=base64key...
JWT_SECRET=secret...
```

#### 4. Fields to Encrypt

**Critical (Must Encrypt):**
- Payment tokens
- SSN / Tax IDs
- Bank account numbers
- API keys / secrets

**Sensitive (Should Encrypt):**
- Email addresses
- Phone numbers
- Physical addresses

**No Need to Encrypt:**
- Public profile data
- Job descriptions
- Portfolio images
- Reviews

#### 5. Security Best Practices Summary

**Phase 1 - MVP Security (Essential - 1-2 days):**
```
✅ HTTPS/TLS everywhere (Let's Encrypt - free, 1 hour setup)
✅ Password hashing (bcrypt - Spring Security default)
✅ JWT tokens (15 min access, 7 day refresh)
✅ Stripe tokenization (Stripe SDK handles encryption)
✅ Input validation (Spring @Valid)
✅ SQL Injection protection (JPA parameterized queries)
✅ XSS Protection (Spring Security defaults)
✅ Rate Limiting (Nginx + Redis)
✅ CORS configuration (Spring Security)
```

**Phase 3+ - Advanced Security (Optional - Add Later):**
```
⏸️  Encrypt at Rest: pgcrypto (Postgres) + CSFLE (MongoDB)
⏸️  Key Management: HashiCorp Vault
⏸️  Field-level encryption for PII (email, phone, address)
⏸️  Encrypted audit logs to Kafka
⏸️  Advanced threat detection
```

**Total MVP Cost: $0** (Let's Encrypt is free)
**MVP Setup Time: 1-2 days** (mostly TLS + testing)

---

### 🎯 Final Recommendation

**Start with Phase 1 MVP Security:**
- TLS/SSL ✅
- bcrypt passwords ✅
- JWT tokens ✅
- Stripe tokenization ✅
- Basic validation ✅

**Defer to Phase 3:**
- Field-level encryption ⏸️
- HashiCorp Vault ⏸️
- Advanced encryption ⏸️

**Why This Works:**
1. **Fast to Production:** 1-2 days vs 1-2 weeks
2. **Secure Enough:** Industry standard for MVP
3. **Easy to Upgrade:** Add encryption layer later without code rewrites
4. **Stripe Handles Payments:** They encrypt everything already
5. **Focus on Features:** Ship faster, validate business model first

**Bottom Line:** Skip field-level encryption in Phase 1, add it in Phase 3 when you have revenue and more time. You'll still be secure and production-ready.

---

### Updated Architecture with Kafka, Beam & Security

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Layer (HTTPS/TLS)                 │
│  Next.js │ React Admin │ Angular Learning               │
└───────────────────────────┬─────────────────────────────┘
                            │ TLS
                    ┌───────▼───────┐
                    │ Nginx (TLS)   │
                    │ API Gateway   │
                    │ Let's Encrypt │
                    └───────┬───────┘
                            │
      ┌─────────────────────┼──────────────────────┐
      │ TLS                 │ TLS                  │ TLS
┌─────▼─────┐     ┌─────────▼────────┐   ┌────────▼──────┐
│   Java    │────▶│  Apache Kafka    │◀──│     .NET      │
│  Service  │     │  Event Streams   │   │    Service    │
│           │     │  (Encrypted)     │   │               │
└─────┬─────┘     └─────────┬────────┘   └────────┬──────┘
      │ TLS               │                       │ TLS
      ▼                   ▼                       ▼
┌─────────────┐    ┌──────────────┐      ┌──────────────┐
│  Postgres   │    │ Apache Beam  │      │   MongoDB    │
│  pgcrypto   │    │  Pipelines   │      │   CSFLE      │
│  Encrypted  │    │  Analytics   │      │  Encrypted   │
└─────────────┘    └──────────────┘      └──────────────┘
```

**Key Benefits:**
- **Kafka:** Event-driven, scalable, audit logs (Phase 2)
- **Apache Beam:** Data pipelines, ML training, GDPR exports (Phase 4)
- **Encryption:** Bank-level security for sensitive data (Phase 1+)
- **Total Cost:** $0 (all free and open-source)

---

**When to Add:**
- **Phase 1 (NOW - 1-2 days):** 
  - ✅ TLS/SSL with Let's Encrypt (Essential, simple)
  - ✅ Password hashing with bcrypt (Already in Spring Security)
  - ✅ Stripe tokenization (Stripe SDK handles it)
  - ✅ JWT tokens with proper expiration
  - ✅ Input validation & parameterized queries
  
- **Phase 2 (Month 3 - 1 week):** 
  - Kafka event streaming (enables real-time features)
  
- **Phase 3 (Month 5 - 1 week):**
  - Field-level encryption for sensitive data (pgcrypto, CSFLE)
  - HashiCorp Vault for key management
  
- **Phase 4 (Month 6 - 2 weeks):** 
  - Apache Beam data pipelines (analytics, ML)

---

### Phase 1 Security Checklist (Simple & Fast)

**Setup Time: 1-2 days maximum**

```bash
# 1. Enable HTTPS with Let's Encrypt (1 hour)
sudo certbot --nginx -d api.marketplace.com
# Auto-renewal configured automatically

# 2. Force HTTPS in Nginx (5 minutes)
# Add to nginx.conf:
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

# 3. Password Hashing - Spring Security (Already done)
# application.yml
spring:
  security:
    password:
      strength: 10  # bcrypt rounds

# 4. JWT Configuration (30 minutes)
# application.yml
jwt:
  secret: ${JWT_SECRET}  # From environment variable
  expiration: 900000     # 15 minutes
  refresh-expiration: 604800000  # 7 days

# 5. Stripe Integration (2 hours)
# Use Stripe.js tokenization (client-side)
# Store only Stripe customer IDs (already encrypted by Stripe)
stripe:
  api-key: ${STRIPE_SECRET_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}

# 6. Input Validation (Already done with Spring)
@Valid @RequestBody CreateJobRequest request

# 7. Rate Limiting in Nginx (30 minutes)
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req zone=general burst=50;

# 8. Database connections with SSL (10 minutes)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/marketplace?ssl=true&sslmode=require
```

**Total Effort: 1-2 days**
**Security Level: Production-ready for MVP**
**No complex encryption needed yet**

---

### When to Add Field-Level Encryption (Later)

**Triggers to add full encryption:**
1. Storing sensitive PII beyond email/phone (SSN, Tax IDs)
2. Compliance requirements (HIPAA, PCI-DSS Level 1)
3. Handling financial data beyond Stripe tokens
4. After Series A funding or 10K+ users
5. Customer/enterprise contracts requiring it

**Migration Path (when ready):**
```sql
-- Add encrypted columns alongside existing ones
ALTER TABLE users ADD COLUMN ssn_encrypted BYTEA;

-- Migrate data (one-time script)
UPDATE users SET ssn_encrypted = pgp_sym_encrypt(ssn, 'key') WHERE ssn IS NOT NULL;

-- Drop unencrypted column after migration
ALTER TABLE users DROP COLUMN ssn;
```

**Time to add later: 1 week** (because infrastructure is already in place)

---


