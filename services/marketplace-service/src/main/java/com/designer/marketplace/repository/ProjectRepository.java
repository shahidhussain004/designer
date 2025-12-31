package com.designer.marketplace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Project;

/**
 * Repository for Project entity (formerly Job)
 * Handles freelance/gig project postings
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Page<Project> findByStatus(Project.ProjectStatus status, Pageable pageable);

    Page<Project> findByClientId(Long clientId, Pageable pageable);

    Page<Project> findByProjectCategoryId(Long categoryId, Pageable pageable);

    Page<Project> findByProjectCategoryIdAndStatus(Long categoryId, Project.ProjectStatus status, Pageable pageable);

    Page<Project> findByExperienceLevelEntityId(Long experienceLevelId, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.status = :status AND " +
            "(:categoryId IS NULL OR p.projectCategory.id = :categoryId) AND " +
            "(:experienceLevelId IS NULL OR p.experienceLevelEntity.id = :experienceLevelId) AND " +
            "(:minBudget IS NULL OR p.budget >= :minBudget) AND " +
            "(:maxBudget IS NULL OR p.budget <= :maxBudget)")
    Page<Project> findByFilters(@Param("status") Project.ProjectStatus status,
            @Param("categoryId") Long categoryId,
            @Param("experienceLevelId") Long experienceLevelId,
            @Param("minBudget") Double minBudget,
            @Param("maxBudget") Double maxBudget,
            Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(p) FROM Project p WHERE p.client.id = :clientId")
    Long countByClientId(@Param("clientId") Long clientId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.client.id = :clientId AND p.status = :status")
    Long countByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") Project.ProjectStatus status);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'OPEN'")
    Long countOpenProjects();

    // Search query
    @Query("SELECT p FROM Project p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.projectCategory.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Project> searchProjects(@Param("searchTerm") String searchTerm, Pageable pageable);
}
