package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.SavedJob;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    /**
     * Find all saved jobs for a specific user, ordered by most recently saved
     */
    @Query("SELECT sj FROM SavedJob sj " +
           "JOIN FETCH sj.job j " +
           "LEFT JOIN FETCH j.company c " +
           "LEFT JOIN FETCH c.user cu " +
           "WHERE sj.user.id = :userId " +
           "ORDER BY sj.createdAt DESC")
    List<SavedJob> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Check if a user has saved a specific job
     */
    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    /**
     * Find a saved job by user and job
     */
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    /**
     * Count how many jobs a user has saved
     */
    long countByUserId(Long userId);

    /**
     * Delete a saved job by user and job
     */
    void deleteByUserIdAndJobId(Long userId, Long jobId);
}
