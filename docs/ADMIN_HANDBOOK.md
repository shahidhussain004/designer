# Designer Marketplace - Admin Handbook

> Comprehensive guide for platform administrators and moderators.

## Table of Contents

- [Admin Overview](#admin-overview)
- [Dashboard](#dashboard)
- [User Management](#user-management)
- [Content Moderation](#content-moderation)
- [Order Management](#order-management)
- [Financial Operations](#financial-operations)
- [Platform Analytics](#platform-analytics)
- [System Configuration](#system-configuration)
- [Security & Compliance](#security--compliance)
- [Incident Response](#incident-response)
- [Appendix](#appendix)

---

## Admin Overview

### Admin Roles & Permissions

| Role | Level | Permissions |
|------|-------|-------------|
| **Super Admin** | 5 | Full system access, configuration, other admin management |
| **Admin** | 4 | User management, moderation, financial operations |
| **Moderator** | 3 | Content moderation, user support, limited financial view |
| **Support Agent** | 2 | User support, read-only access to orders |
| **Analyst** | 1 | Read-only analytics and reports |

### Access Control Matrix

| Action | Super Admin | Admin | Moderator | Support | Analyst |
|--------|:-----------:|:-----:|:---------:|:-------:|:-------:|
| View dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Suspend/ban users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Review content | ✅ | ✅ | ✅ | ❌ | ❌ |
| Process refunds | ✅ | ✅ | ❌ | ❌ | ❌ |
| System config | ✅ | ❌ | ❌ | ❌ | ❌ |
| View financials | ✅ | ✅ | Limited | ❌ | ✅ |
| Manage admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Export data | ✅ | ✅ | ❌ | ❌ | ✅ |

### Accessing Admin Panel

1. Navigate to `/admin` or click "Admin" in the user dropdown
2. Complete 2FA verification (required for all admin accounts)
3. Session timeout: 30 minutes of inactivity

---

## Dashboard

### Overview Metrics

The dashboard displays real-time platform metrics:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  👥 Total Users      🎨 Designers       📦 Active Orders   💰 Revenue│
│     15,432              3,521               847            $125.4K   │
│    (+12% ▲)           (+8% ▲)            (+5% ▲)          (+15% ▲)  │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ⚠️ Pending Actions                                                  │
│  ├── 12 Reports awaiting review                                     │
│  ├── 5 Disputes to resolve                                          │
│  ├── 23 New seller applications                                     │
│  └── 3 Withdrawal requests                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Performance Indicators (KPIs)

| Metric | Description | Target | Alert Threshold |
|--------|-------------|--------|-----------------|
| **User Growth** | New registrations per week | +5% | < 0% |
| **GMV** | Gross Merchandise Value | +10% MoM | < 0% |
| **Order Completion** | % of orders completed | > 95% | < 90% |
| **Dispute Rate** | % of orders with disputes | < 2% | > 5% |
| **Response Time** | Support ticket resolution | < 24h | > 48h |
| **Platform Uptime** | System availability | 99.9% | < 99.5% |

### Quick Actions

- 🔍 **Search**: Find users, orders, gigs by ID or email
- ⚠️ **Alerts**: View system alerts and notifications
- 📊 **Reports**: Generate and export reports
- ⚙️ **Settings**: Quick access to system configuration

---

## User Management

### Finding Users

**Search Options:**
- User ID
- Email address
- Display name
- Phone number
- IP address

**Filters:**
- Account status (Active, Suspended, Banned, Pending)
- User type (Buyer, Seller, Both)
- Registration date
- Last activity
- Location/Country

### User Profile View

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER PROFILE                                          [Actions ▼]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  👤 John Designer                                                    │
│  📧 john@example.com                                                │
│  📅 Member since: Jan 15, 2023                                      │
│  🔵 Status: ACTIVE                                                  │
│  🏷️ Type: SELLER                                                    │
│                                                                      │
├──────────────────────────────┬──────────────────────────────────────┤
│  ACCOUNT INFO                │  ACTIVITY SUMMARY                    │
│  ├── Email verified: ✅      │  ├── Total orders: 156               │
│  ├── Phone verified: ✅      │  ├── Completed: 148                  │
│  ├── ID verified: ✅         │  ├── Cancelled: 5                    │
│  ├── 2FA enabled: ✅         │  ├── Disputed: 3                     │
│  └── Last login: 2h ago      │  └── Avg rating: 4.8 ⭐             │
│                               │                                      │
├──────────────────────────────┴──────────────────────────────────────┤
│  FINANCIAL SUMMARY                                                   │
│  ├── Total earnings: $12,450                                        │
│  ├── Available balance: $840                                        │
│  ├── Pending clearance: $350                                        │
│  └── Total withdrawn: $11,260                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### User Actions

| Action | Description | Required Role |
|--------|-------------|---------------|
| **View Details** | Full user profile and history | Support+ |
| **Edit Profile** | Modify user information | Admin+ |
| **Send Message** | Contact user directly | Moderator+ |
| **Reset Password** | Force password reset | Admin+ |
| **Suspend Account** | Temporary account restriction | Moderator+ |
| **Ban Account** | Permanent account termination | Admin+ |
| **Verify Identity** | Approve ID verification | Moderator+ |
| **Adjust Balance** | Modify user balance | Super Admin |
| **Delete Account** | Permanently delete user data | Super Admin |

### Account Status Management

#### Suspension Process

1. **Investigation**: Document the issue
2. **Warning**: Send warning notification (if applicable)
3. **Suspension**: Apply temporary restriction
4. **Review Period**: Set review date (7-30 days)
5. **Resolution**: Lift or escalate to ban

**Suspension Reasons:**
- Terms of Service violation
- Fraudulent activity (suspected)
- Quality issues
- Payment disputes
- User reports

#### Ban Process

1. **Evidence Collection**: Document all violations
2. **Admin Review**: Requires Admin+ approval
3. **User Notification**: Send ban notification
4. **Account Restriction**: Disable all access
5. **Financial Settlement**: Process pending funds
6. **Appeal Window**: 30-day appeal period

**Ban Reasons:**
- Confirmed fraud
- Repeated policy violations
- Illegal content
- Identity theft
- Harassment/abuse

### Bulk Operations

Available bulk actions:
- Mass email notifications
- Batch status updates
- Export user lists
- Tag/label assignment

---

## Content Moderation

### Gig Review Queue

#### Review Priorities

| Priority | Type | SLA |
|----------|------|-----|
| 🔴 **Critical** | Reported content, policy violations | 2 hours |
| 🟠 **High** | New seller gigs, flagged keywords | 4 hours |
| 🟡 **Medium** | Updated gigs, new categories | 24 hours |
| 🟢 **Low** | Regular updates, description edits | 48 hours |

#### Gig Review Checklist

**Content Quality:**
- [ ] Title is clear and accurate
- [ ] Description is complete and honest
- [ ] Images are original and appropriate
- [ ] Pricing is realistic
- [ ] Delivery times are reasonable

**Policy Compliance:**
- [ ] No prohibited services
- [ ] No contact information in description
- [ ] No copyrighted material
- [ ] No misleading claims
- [ ] Proper categorization

**Legal Review:**
- [ ] No intellectual property violations
- [ ] No illegal services
- [ ] Appropriate for all audiences
- [ ] Complies with local laws

#### Gig Actions

| Action | Description |
|--------|-------------|
| **Approve** | Gig goes live immediately |
| **Request Changes** | Send back with specific feedback |
| **Reject** | Decline with reason |
| **Flag for Review** | Escalate to senior moderator |
| **Delete** | Remove permanently (severe violations) |

### Report Management

#### Report Types

| Type | Description | Priority |
|------|-------------|----------|
| Spam | Unwanted promotional content | Medium |
| Harassment | Abusive behavior | High |
| Fraud | Scam or deceptive practices | Critical |
| IP Violation | Copyright/trademark issues | High |
| Inappropriate | Adult/offensive content | High |
| Quality | Poor service delivery | Medium |
| Other | Miscellaneous issues | Low |

#### Report Investigation Process

```
📥 Report Received
    ↓
🔍 Initial Assessment (15 min)
    ├── Assign priority
    └── Assign to moderator
    ↓
📋 Investigation (varies)
    ├── Review evidence
    ├── Contact parties if needed
    └── Document findings
    ↓
⚖️ Decision
    ├── Dismiss (unfounded)
    ├── Warning (minor)
    ├── Action (violation confirmed)
    └── Escalate (complex cases)
    ↓
📧 Notification
    └── Inform all parties
```

### Message Monitoring

**Automated Flagging:**
- Personal contact information
- External payment mentions
- Prohibited keywords
- Suspicious patterns

**Manual Review Triggers:**
- User reports
- Pattern detection
- High-value transactions
- New account activity

---

## Order Management

### Order Search & Filters

**Search by:**
- Order ID
- Buyer/Seller email
- Gig title
- Date range
- Status

**Filter by:**
- Status (All, Active, Completed, Disputed, Cancelled)
- Amount range
- Category
- Payment method
- Delivery status

### Order Details View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ORDER #ORD-2024-0001234                              Status: ACTIVE │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🛒 GIG: Professional Logo Design                                   │
│  📦 Package: Standard                                               │
│                                                                      │
│  👤 Buyer: buyer@example.com                                        │
│  🎨 Seller: designer@example.com                                    │
│                                                                      │
│  💰 Financials:                                                     │
│     Subtotal:      $100.00                                          │
│     Service Fee:     $5.00                                          │
│     Total:         $105.00                                          │
│                                                                      │
│  📅 Timeline:                                                       │
│     Created:     Jan 15, 2024 10:30 AM                              │
│     Due:         Jan 20, 2024 10:30 AM                              │
│     Delivered:   -                                                  │
│                                                                      │
│  📝 Requirements:                                                   │
│     [View buyer's project requirements]                             │
│                                                                      │
│  💬 Messages: 12 messages exchanged                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Admin Order Actions

| Action | Description | When to Use |
|--------|-------------|-------------|
| **Extend Deadline** | Add time to delivery | Mutual agreement |
| **Force Delivery** | Mark as delivered | Seller unresponsive |
| **Force Complete** | Complete without delivery | Edge cases |
| **Cancel Order** | Cancel with refund | Disputes, inactivity |
| **Split Payment** | Partial refund/payment | Partial completion |
| **Transfer Order** | Assign to different seller | Seller unavailable |

### Dispute Resolution

#### Dispute Categories

1. **Quality Issues** - Work doesn't meet expectations
2. **Non-Delivery** - Seller didn't deliver
3. **Late Delivery** - Missed deadline
4. **Not as Described** - Gig misrepresentation
5. **Communication** - Unresponsive party
6. **Other** - Miscellaneous issues

#### Resolution Process

```
Step 1: Dispute Filed
    └── Auto-assign to resolution team

Step 2: Evidence Collection (48h)
    ├── Request evidence from both parties
    └── Review order history and messages

Step 3: Investigation (24-72h)
    ├── Analyze all evidence
    ├── Check policy compliance
    └── Consider precedents

Step 4: Decision
    ├── Full refund to buyer
    ├── Full payment to seller
    ├── Split payment
    └── Other resolution

Step 5: Implementation
    ├── Process financial adjustments
    └── Apply any account actions

Step 6: Follow-up
    └── Monitor for retaliation/escalation
```

#### Resolution Guidelines

| Scenario | Typical Resolution |
|----------|-------------------|
| Seller no-show (no delivery) | 100% refund |
| Partial delivery | 25-75% refund based on completion |
| Quality below expectations | Revision period first, then partial refund |
| Buyer abandoned | Payment to seller after 14 days |
| Mutual cancellation | 100% refund |
| Terms of Service violation | Varies by case |

---

## Financial Operations

### Transaction Overview

**Transaction Types:**
- Order payments
- Refunds
- Withdrawals
- Adjustments
- Platform fees
- Chargebacks

### Processing Refunds

#### Refund Request Queue

| Status | Description | Action Required |
|--------|-------------|-----------------|
| Pending | Awaiting review | Investigate |
| Approved | Ready to process | Process refund |
| Processing | In progress | Monitor |
| Completed | Refund issued | Close ticket |
| Rejected | Denied | Notify user |

#### Refund Authorization Levels

| Amount | Required Approval |
|--------|-------------------|
| < $100 | Moderator |
| $100 - $500 | Admin |
| $500 - $5,000 | Super Admin |
| > $5,000 | Super Admin + Finance |

### Seller Payouts

#### Payout Schedule

- **Standard**: Weekly (every Thursday)
- **Express**: Daily (Premium sellers)
- **On-demand**: Instant withdrawal (fee applies)

#### Payout Hold Reasons

| Reason | Duration | Resolution |
|--------|----------|------------|
| New account | 14 days | Automatic release |
| Large payout | 3-5 days | Manual review |
| Verification needed | Until verified | Complete verification |
| Account flags | Indefinite | Investigate |
| Chargeback pending | Until resolved | Wait for resolution |

### Chargeback Management

#### Chargeback Response Process

1. **Notification**: Receive chargeback alert
2. **Evidence Gathering** (24h):
   - Order details
   - Delivery proof
   - Communication logs
   - Buyer verification
3. **Response Submission** (48h)
4. **Bank Review** (30-90 days)
5. **Outcome Processing**

#### Chargeback Prevention

- Strong buyer verification
- Clear refund policies
- Detailed order records
- Proactive dispute resolution

---

## Platform Analytics

### Available Reports

| Report | Description | Frequency |
|--------|-------------|-----------|
| **User Growth** | Registration trends | Daily |
| **Revenue** | GMV, fees, payouts | Daily |
| **Orders** | Volume, completion, cancellation | Daily |
| **Categories** | Performance by category | Weekly |
| **Sellers** | Top performers, quality metrics | Weekly |
| **Disputes** | Volume, resolution times | Weekly |
| **Fraud** | Detection, prevention | Daily |
| **Technical** | Performance, errors | Real-time |

### Custom Reports

Build custom reports with:
- Date range selection
- Multiple metrics
- Grouping options
- Export formats (CSV, Excel, PDF)
- Scheduled delivery

### Dashboards

**Operations Dashboard:**
- Real-time order flow
- Active disputes
- Support ticket volume
- System health

**Finance Dashboard:**
- Revenue metrics
- Payout processing
- Refund rates
- Chargeback tracking

**Quality Dashboard:**
- Content moderation queue
- Report resolution
- Seller quality scores
- Platform health score

---

## System Configuration

### Platform Settings

#### General Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Platform Name | Display name | Designer Marketplace |
| Support Email | Contact email | support@... |
| Currency | Primary currency | USD |
| Timezone | Platform timezone | UTC |
| Maintenance Mode | Enable/disable | Off |

#### User Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Registration | Open/closed/invite | Open |
| Email Verification | Required | Yes |
| Phone Verification | Required for sellers | Yes |
| ID Verification | Required for high-value | Optional |
| 2FA | Required for admins | Yes |

#### Order Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Min Order Value | Minimum order amount | $5 |
| Max Order Value | Maximum order amount | $10,000 |
| Clearance Period | Days before payout | 14 |
| Auto-complete | Days after delivery | 3 |
| Max Extensions | Deadline extensions allowed | 3 |

#### Fee Configuration

| Fee Type | Default | Range |
|----------|---------|-------|
| Buyer Service Fee | 5% | 0-15% |
| Seller Commission | 20% | 10-30% |
| Withdrawal Fee | $0 | $0-5 |
| Express Payout Fee | 1% | 0-5% |

### Feature Flags

Toggle features on/off:
- New user onboarding flow
- Advanced search
- AI recommendations
- Video calls
- Instant messaging
- Beta features

### Integration Settings

Configure third-party integrations:
- Payment gateways (Stripe, PayPal)
- Email providers (SendGrid, SES)
- Analytics (Google, Mixpanel)
- CDN (CloudFront, Cloudflare)
- Monitoring (DataDog, New Relic)

---

## Security & Compliance

### Security Monitoring

#### Real-time Alerts

| Alert Type | Trigger | Action |
|------------|---------|--------|
| Failed logins | > 5 attempts | Block IP, notify user |
| New device | Unrecognized device | Require verification |
| Large transaction | > $1,000 | Manual review |
| Velocity check | Unusual activity | Flag account |
| Geographic anomaly | Login from new country | Additional verification |

#### Fraud Detection

**Automated Checks:**
- IP reputation
- Device fingerprinting
- Behavioral analysis
- Payment pattern analysis
- Account age scoring

**Manual Review Triggers:**
- First high-value order
- Multiple accounts same device
- Rapid account changes
- Unusual payout requests

### Compliance Requirements

#### Data Protection (GDPR/CCPA)

- Data access requests: Respond within 30 days
- Deletion requests: Process within 30 days
- Consent management: Document all consent
- Data portability: Provide export functionality

#### Financial Compliance

- KYC verification for sellers
- AML transaction monitoring
- PCI DSS for payment data
- Tax reporting (1099 forms)

### Audit Logs

All admin actions are logged:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "admin": "admin@example.com",
  "action": "USER_SUSPENDED",
  "target": "user-uuid",
  "reason": "Terms of Service violation",
  "details": {
    "violation_type": "fraud",
    "evidence": ["report-123", "report-456"]
  }
}
```

**Log Retention:**
- Admin actions: 7 years
- User activity: 3 years
- System logs: 1 year
- Financial records: 7 years

---

## Incident Response

### Incident Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P1** | Critical | 15 minutes | Platform down, data breach |
| **P2** | High | 1 hour | Payment processing failure |
| **P3** | Medium | 4 hours | Feature degradation |
| **P4** | Low | 24 hours | Minor bugs, UI issues |

### Incident Response Procedure

```
1. DETECTION
   └── Alert received or issue reported

2. TRIAGE (15 min)
   ├── Assess severity
   ├── Assign responder
   └── Start incident channel

3. INVESTIGATION
   ├── Gather information
   ├── Identify root cause
   └── Assess impact

4. MITIGATION
   ├── Implement fix
   ├── Verify resolution
   └── Monitor stability

5. COMMUNICATION
   ├── Internal updates
   ├── User notifications (if needed)
   └── Status page updates

6. POST-MORTEM
   ├── Timeline documentation
   ├── Root cause analysis
   └── Prevention measures
```

### Escalation Contacts

| Role | Contact Method | Availability |
|------|----------------|--------------|
| On-call Engineer | PagerDuty | 24/7 |
| Engineering Manager | Phone/Slack | Business hours |
| VP Engineering | Phone | Critical only |
| Legal Team | Email | Business hours |
| PR/Communications | Phone | As needed |

### Crisis Communication Templates

**User-facing outage message:**
```
We're aware of an issue affecting [service]. Our team is actively 
working to resolve this. We apologize for any inconvenience and 
will provide updates as they become available.
```

**Resolution message:**
```
The issue affecting [service] has been resolved. All systems are 
now operating normally. Thank you for your patience.
```

---

## Appendix

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Quick search |
| `Ctrl+Shift+U` | User lookup |
| `Ctrl+Shift+O` | Order lookup |
| `Ctrl+Shift+R` | Reports |
| `Esc` | Close modal |
| `?` | Show help |

### Status Codes Reference

| Code | Status | Description |
|------|--------|-------------|
| `USR_001` | Active | Normal account |
| `USR_002` | Suspended | Temporary restriction |
| `USR_003` | Banned | Permanent ban |
| `USR_004` | Pending | Awaiting verification |
| `ORD_001` | Active | In progress |
| `ORD_002` | Completed | Successfully finished |
| `ORD_003` | Cancelled | Cancelled by party |
| `ORD_004` | Disputed | Under review |

### Common Procedures

#### Password Reset Request

1. Verify user identity (email + account details)
2. Trigger password reset email
3. Document the request
4. Confirm user received email

#### Account Recovery

1. Collect verification documents
2. Verify against stored data
3. Reset authentication methods
4. Document changes
5. Notify user via verified method

#### Data Export Request

1. Verify requester identity
2. Generate data export
3. Review for sensitive data
4. Deliver via secure method
5. Log the request

### Glossary

| Term | Definition |
|------|------------|
| **GMV** | Gross Merchandise Value - total order value |
| **TPV** | Total Payment Volume - amount processed |
| **ARPU** | Average Revenue Per User |
| **MAU** | Monthly Active Users |
| **DAU** | Daily Active Users |
| **LTV** | Customer Lifetime Value |
| **Churn** | Rate of user loss |
| **NPS** | Net Promoter Score |

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial release |

---

*This document is confidential and intended for authorized personnel only.*
*Last updated: January 2025*
