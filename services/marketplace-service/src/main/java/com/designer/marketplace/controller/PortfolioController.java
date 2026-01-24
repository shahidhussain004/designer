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

        // The userId path parameter could be either a user ID or a freelancer ID
        // Try to find the freelancer associated with this user
        List<PortfolioItem> portfolio = portfolioService.getUserPortfolioByUserId(userId, requesterId);
        
        // Convert to DTO to avoid lazy loading issues
        List<PortfolioItemDTO> dtos = portfolio.stream()
            .map(item -> PortfolioItemDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .projectUrl(item.getProjectUrl())
                .technologies(item.getTechnologies())
                .images(item.getImages())
                .toolsUsed(item.getToolsUsed())
                .skillsDemonstrated(item.getSkillsDemonstrated())
                .startDate(item.getStartDate())
                .endDate(item.getEndDate())
                .displayOrder(item.getDisplayOrder())
                .isVisible(item.getIsVisible())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build())
            .toList();
        
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/portfolio-items")
    public ResponseEntity<PortfolioItem> createPortfolioItem(
            @RequestParam Long userId,
            @RequestBody PortfolioItem portfolioItem) {
        PortfolioItem created = portfolioService.createPortfolioItem(userId, portfolioItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/portfolio-items/{itemId}")
    public ResponseEntity<PortfolioItem> updatePortfolioItem(
            @PathVariable Long itemId,
            @RequestParam Long userId,
            @RequestBody PortfolioItem updates) {
        PortfolioItem updated = portfolioService.updatePortfolioItem(itemId, userId, updates);
        return ResponseEntity.ok(updated);
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
    public ResponseEntity<PortfolioItem> getPortfolioItem(@PathVariable Long itemId) {
        PortfolioItem item = portfolioService.getPortfolioItem(itemId);
        return ResponseEntity.ok(item);
    }
}
