package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.ExperienceLevel;

/**
 * Repository for ExperienceLevel entity
 */
@Repository
public interface ExperienceLevelRepository extends JpaRepository<ExperienceLevel, Long> {

    Optional<ExperienceLevel> findByCode(String code);

    Optional<ExperienceLevel> findByName(String name);

    List<ExperienceLevel> findByIsActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT e FROM ExperienceLevel e WHERE e.isActive = true ORDER BY e.displayOrder ASC")
    List<ExperienceLevel> findAllActiveExperienceLevels();

    boolean existsByCode(String code);

    boolean existsByName(String name);
}
