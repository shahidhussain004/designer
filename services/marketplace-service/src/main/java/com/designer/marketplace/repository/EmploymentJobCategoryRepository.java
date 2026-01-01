package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.EmploymentJobCategory;

/**
 * Repository for EmploymentJobCategory entity
 * Handles categories for traditional employment jobs
 */
@Repository
public interface EmploymentJobCategoryRepository extends JpaRepository<EmploymentJobCategory, Long> {

    Optional<EmploymentJobCategory> findBySlug(String slug);

    Optional<EmploymentJobCategory> findByName(String name);

    List<EmploymentJobCategory> findByIsActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT c FROM EmploymentJobCategory c WHERE c.isActive = true ORDER BY c.displayOrder ASC")
    List<EmploymentJobCategory> findAllActiveCategories();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
