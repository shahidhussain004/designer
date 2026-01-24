package com.designer.marketplace.repository;

import java.util.List;

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

    Page<Project> findByCompanyId(Long companyId, Pageable pageable);

    Page<Project> findByProjectCategoryId(Long categoryId, Pageable pageable);

    Page<Project> findByProjectCategoryIdAndStatus(Long categoryId, Project.ProjectStatus status, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.status = :status AND " +
            "(:categoryId IS NULL OR p.projectCategory.id = :categoryId) AND " +
            "(:experienceLevelId IS NULL OR p.experienceLevel = :experienceLevelId) AND " +
            "(:minBudget IS NULL OR p.budgetMinCents >= :minBudget) AND " +
            "(:maxBudget IS NULL OR p.budgetMaxCents <= :maxBudget)")
    Page<Project> findByFilters(@Param("status") Project.ProjectStatus status,
            @Param("categoryId") Long categoryId,
            @Param("experienceLevelId") String experienceLevelId,
            @Param("minBudget") Long minBudget,
            @Param("maxBudget") Long maxBudget,
            Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(p) FROM Project p WHERE p.company.id = :companyId")
    Long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.company.id = :companyId AND p.status = :status")
    Long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") Project.ProjectStatus status);
    @Query("SELECT p FROM Project p WHERE p.company.id = :companyId AND p.status IN :statuses ORDER BY p.createdAt DESC")
    List<Project> findTopByCompanyIdAndStatusIn(@Param("companyId") Long companyId, 
                                                @Param("statuses") List<Project.ProjectStatus> statuses,
                                                Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.company.id = :companyId AND p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findTopByCompanyIdAndStatus(@Param("companyId") Long companyId,
                                            @Param("status") Project.ProjectStatus status,
                                            Pageable pageable);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = 'OPEN'")
    Long countOpenProjects();

    // Search query
    @Query("SELECT p FROM Project p WHERE " +
            "(:searchTerm IS NULL OR (" +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.projectCategory.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))" +
            "))")
    Page<Project> searchProjects(@Param("searchTerm") String searchTerm, Pageable pageable);
}
