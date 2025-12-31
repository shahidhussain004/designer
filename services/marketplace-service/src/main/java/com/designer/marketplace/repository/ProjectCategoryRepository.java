package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.ProjectCategory;

/**
 * Repository for ProjectCategory entity (formerly JobCategory)
 * Handles categories for freelance/gig projects
 */
@Repository
public interface ProjectCategoryRepository extends JpaRepository<ProjectCategory, Long> {

    Optional<ProjectCategory> findBySlug(String slug);

    Optional<ProjectCategory> findByName(String name);

    List<ProjectCategory> findByIsActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT c FROM ProjectCategory c WHERE c.isActive = true ORDER BY c.displayOrder ASC")
    List<ProjectCategory> findAllActiveCategories();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
