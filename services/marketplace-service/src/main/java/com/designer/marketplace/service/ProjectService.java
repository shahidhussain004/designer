package com.designer.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CreateProjectRequest;
import com.designer.marketplace.dto.ProjectResponse;
import com.designer.marketplace.dto.UpdateProjectRequest;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.ExperienceLevel;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.CompanyRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final ObjectMapper objectMapper;
    private final ExperienceLevelService experienceLevelService;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(Long categoryId, Long experienceLevelId,
            Double minBudget, Double maxBudget, String search, Pageable pageable) {
        log.info("Getting projects with filters - categoryId: {}, experienceLevelId: {}, minBudget: {}, maxBudget: {}, search: {}",
                categoryId, experienceLevelId, minBudget, maxBudget, search);

        if (search != null && !search.trim().isEmpty()) {
            return searchProjects(search, pageable);
        }

        String experienceLevelCode = null;
        if (experienceLevelId != null) {
            ExperienceLevel level = experienceLevelService.getExperienceLevelEntityById(experienceLevelId);
            experienceLevelCode = level.getCode();
        }

        // Convert budget from dollars to cents for database query
        Long minBudgetCents = minBudget != null ? (long)(minBudget * 100) : null;
        Long maxBudgetCents = maxBudget != null ? (long)(maxBudget * 100) : null;

        Project.ProjectStatus status = Project.ProjectStatus.OPEN;
        Page<Project> projects = projectRepository.findByFilters(status, categoryId, experienceLevelCode, minBudgetCents, maxBudgetCents, pageable);
        return projects.map(ProjectResponse::fromEntity);
    }

    @Transactional
    public ProjectResponse getProjectById(Long id) {
        log.info("Getting project by id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        Integer currentViewsCount = project.getViewsCount();
        project.setViewsCount((currentViewsCount != null ? currentViewsCount : 0) + 1);
        projectRepository.save(project);

        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != User.UserRole.COMPANY) {
            throw new RuntimeException("Only companies can create projects");
        }

        log.info("Creating new project by user: {}", currentUser.getUsername());

        Company company = companyRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found for user: " + currentUser.getUsername()));

        Project project = new Project();
        project.setCompany(company);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        
        if (request.getCategoryId() != null) {
            project.setProjectCategory(categoryService.getCategoryEntityById(request.getCategoryId()));
        }
        
        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()) {
            project.setRequiredSkills(objectMapper.valueToTree(request.getRequiredSkills()));
        }
        if (request.getBudget() != null) {
            project.setBudgetMinCents((long)(request.getBudget() * 100));
            project.setBudgetMaxCents((long)(request.getBudget() * 100));
        }

        if (request.getBudgetType() != null) {
            project.setBudgetType(Project.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        project.setEstimatedDurationDays(request.getDuration());

        if (request.getExperienceLevelId() != null) {
            ExperienceLevel level = experienceLevelService.getExperienceLevelEntityById(request.getExperienceLevelId());
            project.setExperienceLevel(level.getCode());
        }

        if (request.getStatus() != null) {
            project.setStatus(Project.ProjectStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            project.setStatus(Project.ProjectStatus.OPEN);
        }

        project.setIsFeatured(false);
        project.setViewsCount(0);
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
        if (!project.getCompany().getId().equals(currentUser.getId())) {
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

        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()) {
            project.setRequiredSkills(objectMapper.valueToTree(request.getRequiredSkills()));
        }

        if (request.getBudget() != null) {
            project.setBudgetMinCents((long)(request.getBudget() * 100));
            project.setBudgetMaxCents((long)(request.getBudget() * 100));
        }

        if (request.getBudgetType() != null) {
            project.setBudgetType(Project.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        if (request.getDuration() != null) {
            project.setEstimatedDurationDays(request.getDuration());
        }

        if (request.getExperienceLevelId() != null) {
            ExperienceLevel level = experienceLevelService.getExperienceLevelEntityById(request.getExperienceLevelId());
            project.setExperienceLevel(level.getCode());
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
        if (!project.getCompany().getId().equals(currentUser.getId())) {
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
        return project.getCompany().getId().equals(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getMyProjects(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.info("Getting projects for user: {}", currentUser.getUsername());
        Page<Project> projects = projectRepository.findByCompanyId(currentUser.getId(), pageable);
        return projects.map(ProjectResponse::fromEntity);
    }
}
