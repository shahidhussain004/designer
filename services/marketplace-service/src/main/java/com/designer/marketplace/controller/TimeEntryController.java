package com.designer.marketplace.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.entity.TimeEntry;
import com.designer.marketplace.service.TimeEntryService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller for Time Entry operations
 */
@RestController
@RequestMapping("/api/time-entries")
@RequiredArgsConstructor
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    @GetMapping
    public ResponseEntity<List<TimeEntry>> getAllTimeEntries() {
        return ResponseEntity.ok(timeEntryService.getAllTimeEntries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeEntry> getTimeEntryById(@PathVariable Long id) {
        return ResponseEntity.ok(timeEntryService.getTimeEntryById(id));
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<TimeEntry>> getTimeEntriesByContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(timeEntryService.getTimeEntriesByContractId(contractId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<TimeEntry>> getTimeEntriesByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(timeEntryService.getTimeEntriesByFreelancerId(freelancerId));
    }

    @PostMapping
    public ResponseEntity<TimeEntry> createTimeEntry(@RequestBody TimeEntry timeEntry) {
        TimeEntry created = timeEntryService.createTimeEntry(timeEntry);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntry> updateTimeEntry(
            @PathVariable Long id,
            @RequestBody TimeEntry updates) {
        TimeEntry updated = timeEntryService.updateTimeEntry(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Long id) {
        timeEntryService.deleteTimeEntry(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/contract/{contractId}/total-hours")
    public ResponseEntity<BigDecimal> getTotalHours(@PathVariable Long contractId) {
        BigDecimal totalHours = timeEntryService.getTotalHoursByContract(contractId);
        return ResponseEntity.ok(totalHours);
    }
}
