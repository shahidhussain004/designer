package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CreateProjectRequest;
import com.designer.marketplace.dto.ProjectResponse;
import com.designer.marketplace.dto.UpdateProjectRequest;
import com.designer.marketplace.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getProjects(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long experienceLevelId,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        log.info("Getting projects - categoryId: {}, experienceLevelId: {}, search: {}, page: {}, size: {}",
                categoryId, experienceLevelId, search, page, size);

        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProjectResponse> projects = projectService.getProjects(categoryId, experienceLevelId, minBudget, maxBudget, search, pageable);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        log.info("Getting project by id: {}", id);
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        log.info("Creating new project");
        ProjectResponse project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @projectService.isProjectOwner(#id)")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {
        log.info("Updating project: {}", id);
        ProjectResponse project = projectService.updateProject(id, request);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @projectService.isProjectOwner(#id)")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.info("Deleting project: {}", id);
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProjectResponse>> searchProjects(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Searching projects with term: {}", q);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProjectResponse> projects = projectService.searchProjects(q, pageable);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/my-projects")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Page<ProjectResponse>> getMyProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting current user's projects");
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProjectResponse> projects = projectService.getMyProjects(pageable);
        return ResponseEntity.ok(projects);
    }


}
