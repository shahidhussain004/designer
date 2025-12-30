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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.service.PortfolioService;
import com.designer.marketplace.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller for Portfolio operations
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserService userService;

    @GetMapping("/users/{userId}/portfolio")
    public ResponseEntity<List<PortfolioItem>> getUserPortfolio(@PathVariable Long userId) {
        Long requesterId = null;
        try {
            requesterId = userService.getCurrentUser().getId();
        } catch (Exception ex) {
            // not authenticated or unable to resolve current user -> treat as anonymous
            requesterId = null;
        }

        List<PortfolioItem> portfolio = portfolioService.getUserPortfolio(userId, requesterId);
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/portfolio")
    public ResponseEntity<PortfolioItem> createPortfolioItem(
            @RequestParam Long userId,
            @RequestBody PortfolioItem portfolioItem) {
        PortfolioItem created = portfolioService.createPortfolioItem(userId, portfolioItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/portfolio/{itemId}")
    public ResponseEntity<PortfolioItem> updatePortfolioItem(
            @PathVariable Long itemId,
            @RequestParam Long userId,
            @RequestBody PortfolioItem updates) {
        PortfolioItem updated = portfolioService.updatePortfolioItem(itemId, userId, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/portfolio/{itemId}")
    public ResponseEntity<Void> deletePortfolioItem(
            @PathVariable Long itemId,
            @RequestParam Long userId) {
        portfolioService.deletePortfolioItem(itemId, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/portfolio/reorder")
    public ResponseEntity<Void> reorderPortfolioItems(
            @RequestParam Long userId,
            @RequestBody Map<String, List<Long>> request) {
        List<Long> orderedIds = request.get("orderedIds");
        portfolioService.reorderPortfolioItems(userId, orderedIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/portfolio/{itemId}")
    public ResponseEntity<PortfolioItem> getPortfolioItem(@PathVariable Long itemId) {
        PortfolioItem item = portfolioService.getPortfolioItem(itemId);
        return ResponseEntity.ok(item);
    }
}
