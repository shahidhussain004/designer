package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.ProjectCategoryResponse;
import com.designer.marketplace.service.ProjectCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/project-categories")
@RequiredArgsConstructor
@Slf4j
public class ProjectCategoryController {

    private final ProjectCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<ProjectCategoryResponse>> getAllCategories() {
        log.info("Getting all project categories");
        List<ProjectCategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProjectCategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        log.info("Getting project category by slug: {}", slug);
        ProjectCategoryResponse category = categoryService.getCategoryBySlug(slug);
        return ResponseEntity.ok(category);
    }
}
