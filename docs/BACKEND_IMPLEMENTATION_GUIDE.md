# Backend Implementation Guide

## Overview
This guide provides implementation steps for the new database tables added in migrations V7-V12.

---

## 1. Portfolio Items

### Entity: `PortfolioItem.java`

```java
package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_items", indexes = {
    @Index(name = "idx_portfolio_user_id", columnList = "user_id"),
    @Index(name = "idx_portfolio_is_visible", columnList = "is_visible"),
    @Index(name = "idx_portfolio_display_order", columnList = "user_id, display_order")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "project_url", columnDefinition = "TEXT")
    private String projectUrl;
    
    @Column(columnDefinition = "TEXT[]")
    private String[] technologies;
    
    @Column(name = "completion_date")
    private LocalDate completionDate;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "is_visible")
    private Boolean isVisible = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### Repository: `PortfolioItemRepository.java`

```java
package com.designer.marketplace.repository;

import com.designer.marketplace.entity.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    
    List<PortfolioItem> findByUserIdAndIsVisibleOrderByDisplayOrderAsc(Long userId, Boolean isVisible);
    
    List<PortfolioItem> findByUserIdOrderByDisplayOrderAsc(Long userId);
    
    @Query("SELECT p FROM PortfolioItem p WHERE p.user.id = :userId AND p.isVisible = true ORDER BY p.displayOrder ASC")
    List<PortfolioItem> findVisiblePortfolioByUserId(Long userId);
    
    Long countByUserId(Long userId);
}
```

### DTO: `PortfolioItemDto.java`

```java
package com.designer.marketplace.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PortfolioItemDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String projectUrl;
    private String[] technologies;
    private LocalDate completionDate;
    private Integer displayOrder;
    private Boolean isVisible;
}
```

### Request DTO: `CreatePortfolioItemRequest.java`

```java
package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreatePortfolioItemRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    private String imageUrl;
    
    private String projectUrl;
    
    @Size(max = 20, message = "Maximum 20 technologies allowed")
    private String[] technologies;
    
    private LocalDate completionDate;
    
    private Boolean isVisible = true;
}
```

### Service: `PortfolioService.java`

```java
package com.designer.marketplace.service;

import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.PortfolioItemRepository;
import com.designer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {
    
    private final PortfolioItemRepository portfolioItemRepository;
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<PortfolioItem> getVisiblePortfolio(Long userId) {
        return portfolioItemRepository.findVisiblePortfolioByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public List<PortfolioItem> getUserPortfolio(Long userId, Long requesterId) {
        // If viewing own portfolio, show all items; otherwise only visible
        if (userId.equals(requesterId)) {
            return portfolioItemRepository.findByUserIdOrderByDisplayOrderAsc(userId);
        }
        return portfolioItemRepository.findVisiblePortfolioByUserId(userId);
    }
    
    @Transactional
    public PortfolioItem createPortfolioItem(Long userId, PortfolioItem item) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        item.setUser(user);
        
        // Set display order to last position
        Long count = portfolioItemRepository.countByUserId(userId);
        item.setDisplayOrder(count.intValue());
        
        return portfolioItemRepository.save(item);
    }
    
    @Transactional
    public PortfolioItem updatePortfolioItem(Long itemId, Long userId, PortfolioItem updates) {
        PortfolioItem existing = portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        
        // Verify ownership
        if (!existing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        existing.setTitle(updates.getTitle());
        existing.setDescription(updates.getDescription());
        existing.setImageUrl(updates.getImageUrl());
        existing.setProjectUrl(updates.getProjectUrl());
        existing.setTechnologies(updates.getTechnologies());
        existing.setCompletionDate(updates.getCompletionDate());
        existing.setIsVisible(updates.getIsVisible());
        
        return portfolioItemRepository.save(existing);
    }
    
    @Transactional
    public void deletePortfolioItem(Long itemId, Long userId) {
        PortfolioItem item = portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
        
        if (!item.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        portfolioItemRepository.delete(item);
    }
    
    @Transactional
    public void reorderPortfolioItems(Long userId, List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long itemId = orderedIds.get(i);
            PortfolioItem item = portfolioItemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Portfolio item not found"));
            
            if (!item.getUser().getId().equals(userId)) {
                throw new RuntimeException("Unauthorized");
            }
            
            item.setDisplayOrder(i);
            portfolioItemRepository.save(item);
        }
    }
}
```

### Controller: `PortfolioController.java`

```java
package com.designer.marketplace.controller;

import com.designer.marketplace.dto.CreatePortfolioItemRequest;
import com.designer.marketplace.dto.PortfolioItemDto;
import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PortfolioController {
    
    private final PortfolioService portfolioService;
    
    @GetMapping("/users/{userId}/portfolio")
    public ResponseEntity<List<PortfolioItem>> getUserPortfolio(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long requesterId = getCurrentUserId(userDetails);
        List<PortfolioItem> items = portfolioService.getUserPortfolio(userId, requesterId);
        return ResponseEntity.ok(items);
    }
    
    @PostMapping("/portfolio")
    public ResponseEntity<PortfolioItem> createPortfolioItem(
            @Valid @RequestBody CreatePortfolioItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = getCurrentUserId(userDetails);
        PortfolioItem item = mapToEntity(request);
        PortfolioItem created = portfolioService.createPortfolioItem(userId, item);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/portfolio/{itemId}")
    public ResponseEntity<PortfolioItem> updatePortfolioItem(
            @PathVariable Long itemId,
            @Valid @RequestBody CreatePortfolioItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = getCurrentUserId(userDetails);
        PortfolioItem item = mapToEntity(request);
        PortfolioItem updated = portfolioService.updatePortfolioItem(itemId, userId, item);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/portfolio/{itemId}")
    public ResponseEntity<Void> deletePortfolioItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = getCurrentUserId(userDetails);
        portfolioService.deletePortfolioItem(itemId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/portfolio/reorder")
    public ResponseEntity<Void> reorderPortfolio(
            @RequestBody List<Long> orderedIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = getCurrentUserId(userDetails);
        portfolioService.reorderPortfolioItems(userId, orderedIds);
        return ResponseEntity.ok().build();
    }
    
    private Long getCurrentUserId(UserDetails userDetails) {
        // Implement based on your UserDetails implementation
        return 1L; // Placeholder
    }
    
    private PortfolioItem mapToEntity(CreatePortfolioItemRequest request) {
        PortfolioItem item = new PortfolioItem();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setImageUrl(request.getImageUrl());
        item.setProjectUrl(request.getProjectUrl());
        item.setTechnologies(request.getTechnologies());
        item.setCompletionDate(request.getCompletionDate());
        item.setIsVisible(request.getIsVisible());
        return item;
    }
}
```

---

## 2. Contracts

### Entity: `Contract.java`

```java
package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts", indexes = {
    @Index(name = "idx_contracts_job_id", columnList = "job_id"),
    @Index(name = "idx_contracts_client_id", columnList = "client_id"),
    @Index(name = "idx_contracts_freelancer_id", columnList = "freelancer_id"),
    @Index(name = "idx_contracts_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id")
    private Proposal proposal;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false, length = 20)
    private ContractType contractType;
    
    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_schedule", length = 20)
    private PaymentSchedule paymentSchedule;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContractStatus status = ContractStatus.DRAFT;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    public enum ContractType {
        FIXED,
        HOURLY
    }
    
    public enum PaymentSchedule {
        UPFRONT,
        MILESTONE,
        HOURLY
    }
    
    public enum ContractStatus {
        DRAFT,
        ACTIVE,
        COMPLETED,
        CANCELLED,
        DISPUTED
    }
}
```

### Repository: `ContractRepository.java`

```java
package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    List<Contract> findByClientIdOrderByCreatedAtDesc(Long clientId);
    
    List<Contract> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);
    
    List<Contract> findByJobId(Long jobId);
    
    List<Contract> findByStatus(Contract.ContractStatus status);
}
```

---

## 3. Reviews

### Entity: `Review.java`

```java
package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_reviews_contract_id", columnList = "contract_id"),
    @Index(name = "idx_reviews_reviewed_user_id", columnList = "reviewed_user_id"),
    @Index(name = "idx_reviews_rating", columnList = "rating")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false, unique = true)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    private User reviewer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    private User reviewedUser;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSONB")
    private Map<String, Integer> categories;
    
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status = ReviewStatus.PUBLISHED;
    
    @Column(name = "flagged_reason", columnDefinition = "TEXT")
    private String flaggedReason;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ReviewStatus {
        DRAFT,
        PUBLISHED,
        HIDDEN,
        FLAGGED
    }
}
```

---

## 4. Update User Entity

Add these fields to `User.java`:

```java
@Column(name = "github_url", length = 500)
private String githubUrl;

@Column(name = "linkedin_url", length = 500)
private String linkedinUrl;

@Column(columnDefinition = "TEXT[]")
private String[] certifications;

@Column(columnDefinition = "TEXT[]")
private String[] languages;

@Column(name = "experience_years")
private Integer experienceYears;

@Enumerated(EnumType.STRING)
@Column(name = "verification_status", length = 20)
private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

@Column(name = "identity_verified")
private Boolean identityVerified = false;

@Column(name = "identity_verified_at")
private LocalDateTime identityVerifiedAt;

@Column(name = "completion_rate", precision = 5, scale = 2)
private BigDecimal completionRate = new BigDecimal("100.00");

@Column(name = "response_time_hours", precision = 5, scale = 1)
private BigDecimal responseTimeHours;

@Column(name = "response_rate", precision = 5, scale = 2)
private BigDecimal responseRate;

public enum VerificationStatus {
    UNVERIFIED,
    PENDING,
    VERIFIED,
    REJECTED
}
```

---

## 5. Testing

### Unit Test Example: `PortfolioServiceTest.java`

```java
@SpringBootTest
@Transactional
class PortfolioServiceTest {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldCreatePortfolioItem() {
        User user = createTestUser();
        
        PortfolioItem item = new PortfolioItem();
        item.setTitle("Test Project");
        item.setDescription("Test Description");
        item.setTechnologies(new String[]{"Java", "Spring Boot"});
        
        PortfolioItem created = portfolioService.createPortfolioItem(user.getId(), item);
        
        assertNotNull(created.getId());
        assertEquals("Test Project", created.getTitle());
        assertEquals(0, created.getDisplayOrder());
    }
    
    private User createTestUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPasswordHash("hashed");
        user.setFullName("Test User");
        return userRepository.save(user);
    }
}
```

---

## Next Steps

1. Run the migrations against your local database
2. Implement the entities, repositories, and services
3. Create comprehensive unit and integration tests
4. Update the OpenAPI specification with new endpoints
5. Implement frontend components
6. Deploy to staging for QA testing

For frontend implementation guide, see `FRONTEND_IMPLEMENTATION_GUIDE.md`.
