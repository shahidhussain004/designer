package com.designer.marketplace.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.ProjectCategoryResponse;
import com.designer.marketplace.entity.ProjectCategory;
import com.designer.marketplace.repository.ProjectCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectCategoryService {

    private final ProjectCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ProjectCategoryResponse> getAllCategories() {
        log.info("Getting all active project categories");
        return categoryRepository.findAllActiveCategories()
                .stream()
                .map(ProjectCategoryResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectCategoryResponse getCategoryById(Long id) {
        ProjectCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return ProjectCategoryResponse.fromEntity(category);
    }

    @Transactional(readOnly = true)
    public ProjectCategory getCategoryEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public ProjectCategoryResponse getCategoryBySlug(String slug) {
        ProjectCategory category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
        return ProjectCategoryResponse.fromEntity(category);
    }
}
