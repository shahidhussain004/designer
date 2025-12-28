package com.designer.marketplace.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.ExperienceLevelResponse;
import com.designer.marketplace.entity.ExperienceLevel;
import com.designer.marketplace.repository.ExperienceLevelRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing experience levels
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ExperienceLevelService {

    private final ExperienceLevelRepository experienceLevelRepository;

    /**
     * Get all active experience levels
     */
    public List<ExperienceLevelResponse> getAllActiveExperienceLevels() {
        log.info("Fetching all active experience levels");
        return experienceLevelRepository.findAllActiveExperienceLevels()
                .stream()
                .map(ExperienceLevelResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get experience level by ID
     */
    public ExperienceLevelResponse getExperienceLevelById(Long id) {
        log.info("Fetching experience level by id: {}", id);
        ExperienceLevel level = experienceLevelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience level not found with id: " + id));
        return ExperienceLevelResponse.fromEntity(level);
    }

    /**
     * Get experience level entity by ID (for internal use)
     */
    public ExperienceLevel getExperienceLevelEntityById(Long id) {
        return experienceLevelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience level not found with id: " + id));
    }

    /**
     * Get experience level by code
     */
    public ExperienceLevelResponse getExperienceLevelByCode(String code) {
        log.info("Fetching experience level by code: {}", code);
        ExperienceLevel level = experienceLevelRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Experience level not found with code: " + code));
        return ExperienceLevelResponse.fromEntity(level);
    }

    /**
     * Get all experience levels (including inactive) - for admin use
     */
    public List<ExperienceLevelResponse> getAllExperienceLevels() {
        log.info("Fetching all experience levels");
        return experienceLevelRepository.findAll()
                .stream()
                .map(ExperienceLevelResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
