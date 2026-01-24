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
    @Query("SELECT p FROM PortfolioItem p WHERE p.freelancer = (SELECT f FROM Freelancer f WHERE f.id = :userId) AND p.isVisible = :isVisible ORDER BY p.displayOrder ASC")
    List<PortfolioItem> findByUserIdAndIsVisibleOrderByDisplayOrderAsc(@Param("userId") Long userId, @Param("isVisible") Boolean isVisible);

    /**
     * Find all portfolio items for a user (regardless of visibility)
     */
    @Query("SELECT p FROM PortfolioItem p WHERE p.freelancer = (SELECT f FROM Freelancer f WHERE f.id = :userId) ORDER BY p.displayOrder ASC")
    List<PortfolioItem> findByUserIdOrderByDisplayOrderAsc(@Param("userId") Long userId);

    /**
     * Find a specific portfolio item by ID and user ID
     */
    @Query("SELECT p FROM PortfolioItem p WHERE p.id = :id AND p.freelancer = (SELECT f FROM Freelancer f WHERE f.id = :userId)")
    PortfolioItem findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    /**
     * Count portfolio items for a user
     */
    @Query("SELECT COUNT(p) FROM PortfolioItem p WHERE p.freelancer = (SELECT f FROM Freelancer f WHERE f.id = :userId) AND p.isVisible = :isVisible")
    Long countByUserIdAndIsVisible(@Param("userId") Long userId, @Param("isVisible") Boolean isVisible);

    /**
     * Update display order for a portfolio item
     */
    @Modifying
    @Query("UPDATE PortfolioItem p SET p.displayOrder = :displayOrder WHERE p.id = :id")
    void updateDisplayOrder(@Param("id") Long id, @Param("displayOrder") Integer displayOrder);

    /**
     * Delete all portfolio items for a user
     */
    @Modifying
    @Query("DELETE FROM PortfolioItem p WHERE p.freelancer = (SELECT f FROM Freelancer f WHERE f.id = :userId)")
    void deleteByUserId(@Param("userId") Long userId);
}
