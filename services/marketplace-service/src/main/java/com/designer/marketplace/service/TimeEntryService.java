package com.designer.marketplace.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.designer.marketplace.entity.TimeEntry;
import com.designer.marketplace.repository.TimeEntryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Time Entry operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;

    public List<TimeEntry> getAllTimeEntries() {
        return timeEntryRepository.findAll();
    }

    public TimeEntry getTimeEntryById(Long id) {
        return timeEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time entry not found: " + id));
    }

    public List<TimeEntry> getTimeEntriesByContractId(Long contractId) {
        return timeEntryRepository.findByContractIdOrderByWorkDateDesc(contractId);
    }

    public List<TimeEntry> getTimeEntriesByFreelancerId(Long freelancerId) {
        return timeEntryRepository.findByFreelancerIdOrderByWorkDateDesc(freelancerId);
    }

    public TimeEntry createTimeEntry(TimeEntry timeEntry) {
        log.info("Creating new time entry");
        return timeEntryRepository.save(timeEntry);
    }

    public TimeEntry updateTimeEntry(Long id, TimeEntry updates) {
        TimeEntry existing = getTimeEntryById(id);
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getHoursLogged() != null) existing.setHoursLogged(updates.getHoursLogged());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        return timeEntryRepository.save(existing);
    }

    public void deleteTimeEntry(Long id) {
        timeEntryRepository.deleteById(id);
    }

    public BigDecimal getTotalHoursByContract(Long contractId) {
        return timeEntryRepository.calculateTotalHoursByContract(contractId);
    }
}
