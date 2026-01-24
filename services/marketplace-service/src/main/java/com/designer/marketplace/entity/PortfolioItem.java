package com.designer.marketplace.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PortfolioItem entity - Project showcase items in freelancer portfolio
 * Maps to 'portfolio_items' table in PostgreSQL
 */
@Entity
@Table(name = "portfolio_items", indexes = {
    @Index(name = "idx_portfolio_items_user_id", columnList = "user_id"),
        @Index(name = "idx_portfolio_items_visible", columnList = "is_visible")
})
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE portfolio_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Freelancer freelancer;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "project_url", length = 500)
    private String projectUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "technologies", columnDefinition = "jsonb")
    private JsonNode technologies;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "images", columnDefinition = "jsonb")
    private JsonNode images;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tools_used", columnDefinition = "jsonb")
    private JsonNode toolsUsed;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "skills_demonstrated", columnDefinition = "jsonb")
    private JsonNode skillsDemonstrated;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

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

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
