package com.designer.marketplace.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.PortfolioItemDTO;
import com.designer.marketplace.dto.PortfolioItemRequest;
import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.service.PortfolioService;
import com.designer.marketplace.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller for Portfolio operations
 * 
 * Endpoints:
 * - GET /api/users/{userId}/portfolio-items - Get user's portfolio items
 * - GET /api/portfolio-items/{itemId} - Get portfolio item by ID
 * - POST /api/portfolio-items - Create portfolio item
 * - PUT /api/portfolio-items/{itemId} - Update portfolio item
 * - DELETE /api/portfolio-items/{itemId} - Delete portfolio item
 * - PATCH /api/portfolio-items/reorder - Reorder portfolio items
 */
@RestController
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;

    @GetMapping("/users/{userId}/portfolio-items")
    public ResponseEntity<List<PortfolioItemDTO>> getUserPortfolio(@PathVariable Long userId) {
        Long requesterId = null;
        try {
            requesterId = userService.getCurrentUser().getId();
        } catch (Exception ex) {
            // not authenticated or unable to resolve current user -> treat as anonymous
            requesterId = null;
        }

        List<PortfolioItem> portfolio = portfolioService.getUserPortfolioByUserId(userId, requesterId);

        List<PortfolioItemDTO> dtos = portfolio.stream()
            .map(item -> toDTO(item, userId))
            .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/portfolio-items")
    public ResponseEntity<PortfolioItemDTO> createPortfolioItem(
            @RequestBody PortfolioItemRequest request) {
        PortfolioItem created = portfolioService.createPortfolioItem(request.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(created, request.getUserId()));
    }

    @PutMapping("/portfolio-items/{itemId}")
    public ResponseEntity<PortfolioItemDTO> updatePortfolioItem(
            @PathVariable Long itemId,
            @RequestBody PortfolioItemRequest request) {
        PortfolioItem updated = portfolioService.updatePortfolioItem(itemId, request.getUserId(), request);
        return ResponseEntity.ok(toDTO(updated, request.getUserId()));
    }

    @DeleteMapping("/portfolio-items/{itemId}")
    public ResponseEntity<Void> deletePortfolioItem(
            @PathVariable Long itemId,
            @RequestParam Long userId) {
        portfolioService.deletePortfolioItem(itemId, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/portfolio-items/reorder")
    public ResponseEntity<Void> reorderPortfolioItems(
            @RequestParam Long userId,
            @RequestBody Map<String, List<Long>> request) {
        List<Long> orderedIds = request.get("orderedIds");
        portfolioService.reorderPortfolioItems(userId, orderedIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/portfolio-items/{itemId}")
    public ResponseEntity<PortfolioItemDTO> getPortfolioItem(@PathVariable Long itemId) {
        PortfolioItem item = portfolioService.getPortfolioItem(itemId);
        return ResponseEntity.ok(toDTO(item, null));
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private PortfolioItemDTO toDTO(PortfolioItem item, Long userId) {
        return PortfolioItemDTO.builder()
            .id(item.getId())
            .userId(userId)
            .title(item.getTitle())
            .description(item.getDescription())
            .imageUrl(item.getImageUrl())
            .thumbnailUrl(item.getThumbnailUrl())
            .projectUrl(item.getProjectUrl())
            .liveUrl(item.getLiveUrl())
            .githubUrl(item.getGithubUrl())
            .sourceUrl(item.getSourceUrl())
            .projectCategory(item.getProjectCategory())
            .technologies(item.getTechnologies())
            .images(item.getImages())
            .toolsUsed(item.getToolsUsed())
            .skillsDemonstrated(item.getSkillsDemonstrated())
            .startDate(item.getStartDate())
            .endDate(item.getEndDate())
            .displayOrder(item.getDisplayOrder())
            .highlightOrder(item.getHighlightOrder())
            .isVisible(item.getIsVisible())
            .createdAt(item.getCreatedAt())
            .updatedAt(item.getUpdatedAt())
            .build();
    }
}