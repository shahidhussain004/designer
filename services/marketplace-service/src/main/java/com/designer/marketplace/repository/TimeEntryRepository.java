package com.designer.marketplace.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.TimeEntry;
import com.designer.marketplace.entity.TimeEntry.TimeEntryStatus;

/**
 * Repository interface for Time Entry operations
 */
@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    /**
     * Find all time entries for a contract
     */
    List<TimeEntry> findByContractIdOrderByWorkDateDesc(Long contractId);

    /**
     * Find all time entries for a freelancer
     */
    List<TimeEntry> findByFreelancerIdOrderByWorkDateDesc(Long freelancerId);

    /**
     * Find time entries by status
     */
    List<TimeEntry> findByStatus(TimeEntryStatus status);

    /**
     * Find time entries for a contract with a specific status
     */
    List<TimeEntry> findByContractIdAndStatus(Long contractId, TimeEntryStatus status);

    /**
     * Find time entries for a date range
     */
    @Query("SELECT t FROM TimeEntry t WHERE t.contract.id = :contractId AND t.workDate BETWEEN :startDate AND :endDate")
    List<TimeEntry> findByContractAndDateRange(
            @Param("contractId") Long contractId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Calculate total hours for a contract
     */
    @Query("SELECT COALESCE(SUM(t.hoursWorked), 0) FROM TimeEntry t WHERE t.contract.id = :contractId AND t.status = 'APPROVED'")
    BigDecimal calculateTotalHoursByContract(@Param("contractId") Long contractId);

    /**
     * Calculate total amount earned for a contract
     */
    @Query("SELECT COALESCE(SUM(t.hoursWorked * t.ratePerHour), 0) FROM TimeEntry t WHERE t.contract.id = :contractId AND t.status = 'PAID'")
    BigDecimal calculateTotalEarningsByContract(@Param("contractId") Long contractId);
}
