package com.designer.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.PortfolioItem;

/**
 * Repository interface for Portfolio Item operations
 */
@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {

    /**
     * Find all visible portfolio items for a user, ordered by display order
     */
    List<PortfolioItem> findByUserIdAndIsVisibleOrderByDisplayOrderAsc(Long userId, Boolean isVisible);

    /**
     * Find all portfolio items for a user (regardless of visibility)
     */
    List<PortfolioItem> findByUserIdOrderByDisplayOrderAsc(Long userId);

    /**
     * Find a specific portfolio item by ID and user ID
     */
    PortfolioItem findByIdAndUserId(Long id, Long userId);

    /**
     * Count portfolio items for a user
     */
    Long countByUserIdAndIsVisible(Long userId, Boolean isVisible);

    /**
     * Update display order for a portfolio item
     */
    @Modifying
    @Query("UPDATE PortfolioItem p SET p.displayOrder = :displayOrder WHERE p.id = :id")
    void updateDisplayOrder(@Param("id") Long id, @Param("displayOrder") Integer displayOrder);

    /**
     * Delete all portfolio items for a user
     */
    void deleteByUserId(Long userId);
}
