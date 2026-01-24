package com.designer.marketplace.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.ExperienceLevelResponse;
import com.designer.marketplace.service.ExperienceLevelService;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for experience levels
 */
@RestController
@RequestMapping("/experience-levels")
@RequiredArgsConstructor
public class ExperienceLevelController {

    private static final Logger log = LoggerFactory.getLogger(ExperienceLevelController.class);
    private final ExperienceLevelService experienceLevelService;

    @GetMapping
    public ResponseEntity<List<ExperienceLevelResponse>> getAllActiveExperienceLevels() {
        log.info("GET /api/experience-levels - Fetching all active experience levels");
        return ResponseEntity.ok(experienceLevelService.getAllActiveExperienceLevels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceLevelResponse> getExperienceLevelById(@PathVariable Long id) {
        log.info("GET /api/experience-levels/{} - Fetching experience level by id", id);
        return ResponseEntity.ok(experienceLevelService.getExperienceLevelById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ExperienceLevelResponse> getExperienceLevelByCode(@PathVariable String code) {
        log.info("GET /api/experience-levels/code/{} - Fetching experience level by code", code);
        return ResponseEntity.ok(experienceLevelService.getExperienceLevelByCode(code));
    }
}
