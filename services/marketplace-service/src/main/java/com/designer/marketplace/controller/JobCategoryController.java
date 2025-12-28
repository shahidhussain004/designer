package com.designer.marketplace.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.JobCategoryResponse;
import com.designer.marketplace.service.JobCategoryService;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for job categories
 */
@RestController
@RequestMapping("/api/job-categories")
@RequiredArgsConstructor
public class JobCategoryController {

    private static final Logger log = LoggerFactory.getLogger(JobCategoryController.class);
    private final JobCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<JobCategoryResponse>> getAllActiveCategories() {
        log.info("GET /api/job-categories - Fetching all active categories");
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobCategoryResponse> getCategoryById(@PathVariable Long id) {
        log.info("GET /api/job-categories/{} - Fetching category by id", id);
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<JobCategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        log.info("GET /api/job-categories/slug/{} - Fetching category by slug", slug);
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }
}
