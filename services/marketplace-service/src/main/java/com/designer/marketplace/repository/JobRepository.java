package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for Job entity
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    Page<Job> findByClientId(Long clientId, Pageable pageable);

    Page<Job> findByCategory(String category, Pageable pageable);
}
