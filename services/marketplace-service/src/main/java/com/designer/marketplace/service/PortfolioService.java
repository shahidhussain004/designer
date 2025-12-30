package com.designer.marketplace.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.PortfolioItemRepository;
import com.designer.marketplace.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Portfolio Item operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    /**
     * Get visible portfolio items for a user
     */
    @Transactional
    public List<PortfolioItem> getVisiblePortfolio(Long userId) {
        log.debug("Fetching visible portfolio for user: {}", userId);
        List<PortfolioItem> items = portfolioItemRepository.findByUserIdAndIsVisibleOrderByDisplayOrderAsc(userId, true);
        // Eagerly fetch user to avoid lazy loading issues
        items.forEach(item -> item.getUser().getUsername());
        return items;
    }

    /**
     * Get all portfolio items for a user (admin/owner view)
     */
    @Transactional
    public List<PortfolioItem> getUserPortfolio(Long userId, Long requesterId) {
        log.debug("Fetching portfolio for user: {} by requester: {}", userId, requesterId);

        List<PortfolioItem> items;

        boolean isOwner = (requesterId != null && requesterId.equals(userId));
        boolean isAdmin = false;

        if (requesterId != null) {
            try {
                User current = userService.getCurrentUser();
                isAdmin = userService.isAdmin(current);
            } catch (Exception ex) {
                // ignore and treat as non-admin
                isAdmin = false;
            }
        }

        // If owner or admin, show all items
        if (isOwner || isAdmin) {
            items = portfolioItemRepository.findByUserIdOrderByDisplayOrderAsc(userId);
        } else {
            // Otherwise show only visible items
            items = portfolioItemRepository.findByUserIdAndIsVisibleOrderByDisplayOrderAsc(userId, true);
        }

        // Eagerly fetch user to avoid lazy loading issues
        items.forEach(item -> item.getUser().getUsername());
        return items;
    }

    /**
     * Create a new portfolio item
     */
    @Transactional
    public PortfolioItem createPortfolioItem(Long userId, PortfolioItem item) {
        log.info("Creating portfolio item for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        item.setUser(user);
        
        // Set display order to end of list if not specified
        if (item.getDisplayOrder() == null || item.getDisplayOrder() == 0) {
            Long count = portfolioItemRepository.countByUserIdAndIsVisible(userId, true);
            item.setDisplayOrder(count.intValue() + 1);
        }
        
        return portfolioItemRepository.save(item);
    }

    /**
     * Update a portfolio item
     */
    @Transactional
    public PortfolioItem updatePortfolioItem(Long itemId, Long userId, PortfolioItem updates) {
        log.info("Updating portfolio item: {} for user: {}", itemId, userId);
        
        PortfolioItem existing = portfolioItemRepository.findByIdAndUserId(itemId, userId);
        if (existing == null) {
            throw new RuntimeException("Portfolio item not found or access denied");
        }
        
        // Update fields
        if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getImageUrl() != null) existing.setImageUrl(updates.getImageUrl());
        if (updates.getProjectUrl() != null) existing.setProjectUrl(updates.getProjectUrl());
        if (updates.getTechnologies() != null) existing.setTechnologies(updates.getTechnologies());
        if (updates.getCompletionDate() != null) existing.setCompletionDate(updates.getCompletionDate());
        if (updates.getIsVisible() != null) existing.setIsVisible(updates.getIsVisible());
        
        return portfolioItemRepository.save(existing);
    }

    /**
     * Delete a portfolio item
     */
    @Transactional
    public void deletePortfolioItem(Long itemId, Long userId) {
        log.info("Deleting portfolio item: {} for user: {}", itemId, userId);
        
        PortfolioItem existing = portfolioItemRepository.findByIdAndUserId(itemId, userId);
        if (existing == null) {
            throw new RuntimeException("Portfolio item not found or access denied");
        }
        
        portfolioItemRepository.deleteById(itemId);
    }

    /**
     * Reorder portfolio items
     */
    @Transactional
    public void reorderPortfolioItems(Long userId, List<Long> orderedIds) {
        log.info("Reordering portfolio items for user: {}", userId);
        
        for (int i = 0; i < orderedIds.size(); i++) {
            Long itemId = orderedIds.get(i);
            portfolioItemRepository.updateDisplayOrder(itemId, i + 1);
        }
    }

    /**
     * Get portfolio item by ID
     */
    public PortfolioItem getPortfolioItem(Long itemId) {
        return portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Portfolio item not found: " + itemId));
    }
}
