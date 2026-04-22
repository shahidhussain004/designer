package com.designer.marketplace.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.designer.marketplace.dto.PortfolioItemRequest;
import com.designer.marketplace.entity.Freelancer;
import com.designer.marketplace.entity.PortfolioItem;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.FreelancerRepository;
import com.designer.marketplace.repository.PortfolioItemRepository;
import com.designer.marketplace.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final FreelancerRepository freelancerRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    /**
     * Get visible portfolio items for a user
     */
    @Transactional
    public List<PortfolioItem> getVisiblePortfolio(Long freelancerId) {
        log.debug("Fetching visible portfolio for freelancer: {}", freelancerId);
        List<PortfolioItem> items = portfolioItemRepository.findAll().stream()
                .filter(item -> item.getFreelancer() != null && item.getFreelancer().getId().equals(freelancerId))
                .toList();
        return items;
    }

    /**
     * Get all portfolio items for a user by their user ID
     * Handles the mapping from user ID to freelancer ID
     */
    @Transactional
    public List<PortfolioItem> getUserPortfolioByUserId(Long userId, Long requesterId) {
        log.debug("Fetching portfolio for user: {} by requester: {}", userId, requesterId);
        
        // Find the freelancer profile for this user
        Freelancer freelancer = freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + userId));
        
        // Now get the portfolio for this freelancer
        return getUserPortfolio(freelancer.getId(), requesterId);
    }

    /**
     * Get all portfolio items for a freelancer (admin/owner view)
     */
    @Transactional
    public List<PortfolioItem> getUserPortfolio(Long freelancerId, Long requesterId) {
        log.debug("Fetching portfolio for freelancer: {} by requester: {}", freelancerId, requesterId);

        boolean isOwner = (requesterId != null && requesterId.equals(freelancerId));
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

        // If owner or admin, show all items; otherwise show only visible items
        List<PortfolioItem> items;
        if (isOwner || isAdmin) {
            items = portfolioItemRepository.findByUserIdOrderByDisplayOrderAsc(freelancerId);
        } else {
            items = portfolioItemRepository.findByUserIdAndIsVisibleOrderByDisplayOrderAsc(freelancerId, true);
        }

        return items;
    }

    /**
     * Create a new portfolio item.
     * Looks up the freelancer profile by the user's account ID.
     */
    @Transactional
    public PortfolioItem createPortfolioItem(Long userId, PortfolioItemRequest request) {
        log.info("Creating portfolio item for user: {}", userId);

        // BUG FIX: was findById(freelancerId) — must find by USER id, not freelancer id
        Freelancer freelancer = freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + userId));

        PortfolioItem item = new PortfolioItem();
        item.setFreelancer(freelancer);

        applyRequest(item, request);

        // Auto-assign display order when none (or 0) supplied
        if (item.getDisplayOrder() == null || item.getDisplayOrder() == 0) {
            int count = portfolioItemRepository.findByUserIdOrderByDisplayOrderAsc(freelancer.getId()).size();
            item.setDisplayOrder(count + 1);
        }

        return portfolioItemRepository.save(item);
    }

    /**
     * Update an existing portfolio item.
     * Resolves the freelancer by user account ID so the ownership check is correct.
     */
    @Transactional
    public PortfolioItem updatePortfolioItem(Long itemId, Long userId, PortfolioItemRequest request) {
        log.info("Updating portfolio item: {} for user: {}", itemId, userId);

        // BUG FIX: was passing userId directly as freelancer id
        Freelancer freelancer = freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + userId));

        PortfolioItem existing = portfolioItemRepository.findByIdAndUserId(itemId, freelancer.getId());
        if (existing == null) {
            throw new RuntimeException("Portfolio item not found or access denied");
        }

        applyRequest(existing, request);
        return portfolioItemRepository.save(existing);
    }

    /**
     * Delete a portfolio item.
     * Resolves the freelancer by user account ID so the ownership check is correct.
     */
    @Transactional
    public void deletePortfolioItem(Long itemId, Long userId) {
        log.info("Deleting portfolio item: {} for user: {}", itemId, userId);

        // BUG FIX: was passing userId directly as freelancer id
        Freelancer freelancer = freelancerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + userId));

        PortfolioItem existing = portfolioItemRepository.findByIdAndUserId(itemId, freelancer.getId());
        if (existing == null) {
            throw new RuntimeException("Portfolio item not found or access denied");
        }

        portfolioItemRepository.deleteById(itemId);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Copies non-null fields from the request DTO onto the entity.
     * Handles List<String> → JsonNode conversion and completionDate → endDate mapping.
     * IMPORTANT: Ensures JSONB fields (images, technologies, toolsUsed, skillsDemonstrated)
     * are never NULL since the DB has NOT NULL constraints with DEFAULT '[]'::jsonb
     */
    private void applyRequest(PortfolioItem item, PortfolioItemRequest req) {
        if (req.getTitle() != null)           item.setTitle(req.getTitle());
        if (req.getDescription() != null)     item.setDescription(req.getDescription());
        if (req.getImageUrl() != null)        item.setImageUrl(req.getImageUrl());
        if (req.getThumbnailUrl() != null)    item.setThumbnailUrl(req.getThumbnailUrl());
        if (req.getProjectUrl() != null)      item.setProjectUrl(req.getProjectUrl());
        if (req.getLiveUrl() != null)         item.setLiveUrl(req.getLiveUrl());
        if (req.getGithubUrl() != null)       item.setGithubUrl(req.getGithubUrl());
        if (req.getSourceUrl() != null)       item.setSourceUrl(req.getSourceUrl());
        if (req.getProjectCategory() != null) item.setProjectCategory(req.getProjectCategory());
        if (req.getStartDate() != null)       item.setStartDate(req.getStartDate());
        // "completionDate" from the frontend maps to the entity's "endDate" column
        if (req.getCompletionDate() != null)  item.setEndDate(req.getCompletionDate());
        if (req.getDisplayOrder() != null)    item.setDisplayOrder(req.getDisplayOrder());
        if (req.getHighlightOrder() != null)  item.setHighlightOrder(req.getHighlightOrder());
        if (req.getIsVisible() != null)       item.setIsVisible(req.getIsVisible());
        
        // Handle images: if provided, use it; otherwise keep as empty array
        if (req.getImages() != null) {
            item.setImages(req.getImages());
        } else if (item.getImages() == null) {
            item.setImages(objectMapper.createArrayNode());
        }

        // Convert List<String> → JsonNode (JSONB in Postgres)
        // If not provided, keep as empty array to satisfy NOT NULL constraint
        if (req.getTechnologies() != null) {
            item.setTechnologies(objectMapper.valueToTree(req.getTechnologies()));
        } else if (item.getTechnologies() == null) {
            item.setTechnologies(objectMapper.createArrayNode());
        }
        
        if (req.getToolsUsed() != null) {
            item.setToolsUsed(objectMapper.valueToTree(req.getToolsUsed()));
        } else if (item.getToolsUsed() == null) {
            item.setToolsUsed(objectMapper.createArrayNode());
        }
        
        if (req.getSkillsDemonstrated() != null) {
            item.setSkillsDemonstrated(objectMapper.valueToTree(req.getSkillsDemonstrated()));
        } else if (item.getSkillsDemonstrated() == null) {
            item.setSkillsDemonstrated(objectMapper.createArrayNode());
        }
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
