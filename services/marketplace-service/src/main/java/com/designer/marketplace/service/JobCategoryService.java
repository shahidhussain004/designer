package com.designer.marketplace.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.JobCategoryResponse;
import com.designer.marketplace.entity.JobCategory;
import com.designer.marketplace.repository.JobCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing job categories
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class JobCategoryService {

    private final JobCategoryRepository categoryRepository;

    /**
     * Get all active categories
     */
    public List<JobCategoryResponse> getAllActiveCategories() {
        log.info("Fetching all active job categories");
        return categoryRepository.findAllActiveCategories()
                .stream()
                .map(JobCategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get category by ID
     */
    public JobCategoryResponse getCategoryById(Long id) {
        log.info("Fetching job category by id: {}", id);
        JobCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return JobCategoryResponse.fromEntity(category);
    }

    /**
     * Get category entity by ID (for internal use)
     */
    public JobCategory getCategoryEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    /**
     * Get category by slug
     */
    public JobCategoryResponse getCategoryBySlug(String slug) {
        log.info("Fetching job category by slug: {}", slug);
        JobCategory category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
        return JobCategoryResponse.fromEntity(category);
    }

    /**
     * Get all categories (including inactive) - for admin use
     */
    public List<JobCategoryResponse> getAllCategories() {
        log.info("Fetching all job categories");
        return categoryRepository.findAll()
                .stream()
                .map(JobCategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
