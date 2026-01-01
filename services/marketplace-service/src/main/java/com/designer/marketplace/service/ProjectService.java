package com.designer.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CreateProjectRequest;
import com.designer.marketplace.dto.ProjectResponse;
import com.designer.marketplace.dto.UpdateProjectRequest;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for project management operations (freelance/gig work)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final ProjectCategoryService categoryService;
    private final ExperienceLevelService experienceLevelService;

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(Long categoryId, Long experienceLevelId,
            Double minBudget, Double maxBudget, String search, Pageable pageable) {
        log.info("Getting projects with filters - categoryId: {}, experienceLevelId: {}, minBudget: {}, maxBudget: {}, search: {}",
                categoryId, experienceLevelId, minBudget, maxBudget, search);

        if (search != null && !search.trim().isEmpty()) {
            return searchProjects(search, pageable);
        }

        Project.ProjectStatus status = Project.ProjectStatus.OPEN;
        Page<Project> projects = projectRepository.findByFilters(status, categoryId, experienceLevelId, minBudget, maxBudget, pageable);
        return projects.map(ProjectResponse::fromEntity);
    }

    @Transactional
    public ProjectResponse getProjectById(Long id) {
        log.info("Getting project by id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        Integer currentViewCount = project.getViewCount();
        project.setViewCount((currentViewCount != null ? currentViewCount : 0) + 1);
        projectRepository.save(project);

        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != User.UserRole.CLIENT) {
            throw new RuntimeException("Only clients can create projects");
        }

        log.info("Creating new project by user: {}", currentUser.getUsername());

        Project project = new Project();
        project.setClient(currentUser);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        
        if (request.getCategoryId() != null) {
            project.setProjectCategory(categoryService.getCategoryEntityById(request.getCategoryId()));
        }
        
        project.setRequiredSkills(request.getRequiredSkills());
        project.setBudget(request.getBudget());

        if (request.getBudgetType() != null) {
            project.setBudgetType(Project.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        project.setDuration(request.getDuration());

        if (request.getExperienceLevelId() != null) {
            project.setExperienceLevelEntity(experienceLevelService.getExperienceLevelEntityById(request.getExperienceLevelId()));
        }

        if (request.getStatus() != null) {
            project.setStatus(Project.ProjectStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            project.setStatus(Project.ProjectStatus.OPEN);
        }

        project.setIsFeatured(false);
        project.setViewCount(0);
        project.setProposalCount(0);

        Project savedProject = projectRepository.save(project);
        log.info("Project created with id: {}", savedProject.getId());

        return ProjectResponse.fromEntity(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!project.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own projects");
        }

        log.info("Updating project: {}", id);

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        if (request.getCategoryId() != null) {
            project.setProjectCategory(categoryService.getCategoryEntityById(request.getCategoryId()));
        }

        if (request.getRequiredSkills() != null) {
            project.setRequiredSkills(request.getRequiredSkills());
        }

        if (request.getBudget() != null) {
            project.setBudget(request.getBudget());
        }

        if (request.getBudgetType() != null) {
            project.setBudgetType(Project.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        if (request.getDuration() != null) {
            project.setDuration(request.getDuration());
        }

        if (request.getExperienceLevelId() != null) {
            project.setExperienceLevelEntity(experienceLevelService.getExperienceLevelEntityById(request.getExperienceLevelId()));
        }

        if (request.getStatus() != null) {
            project.setStatus(Project.ProjectStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Project updatedProject = projectRepository.save(project);
        log.info("Project updated: {}", updatedProject.getId());

        return ProjectResponse.fromEntity(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!project.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own projects");
        }

        log.info("Deleting project: {}", id);
        projectRepository.delete(project);
        log.info("Project deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> searchProjects(String searchTerm, Pageable pageable) {
        log.info("Searching projects with term: {}", searchTerm);
        Page<Project> projects = projectRepository.searchProjects(searchTerm, pageable);
        return projects.map(ProjectResponse::fromEntity);
    }

    public boolean isProjectOwner(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        User currentUser = userService.getCurrentUser();
        return project.getClient().getId().equals(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getMyProjects(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.info("Getting projects for user: {}", currentUser.getUsername());
        Page<Project> projects = projectRepository.findByClientId(currentUser.getId(), pageable);
        return projects.map(ProjectResponse::fromEntity);
    }
}
