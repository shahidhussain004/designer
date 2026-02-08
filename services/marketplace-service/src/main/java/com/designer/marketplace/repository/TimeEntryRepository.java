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
    @Query("SELECT t FROM TimeEntry t WHERE t.contract.id = :contractId ORDER BY t.date DESC")
    List<TimeEntry> findByContractIdOrderByWorkDateDesc(@Param("contractId") Long contractId);

    /**
     * Find all time entries for a freelancer
     */
    @Query("SELECT t FROM TimeEntry t WHERE t.freelancer.id = :freelancerId ORDER BY t.date DESC")
    List<TimeEntry> findByFreelancerIdOrderByWorkDateDesc(@Param("freelancerId") Long freelancerId);

    /**
     * Find time entries by status
     */
    List<TimeEntry> findByStatus(TimeEntryStatus status);

    /**
     * Find time entries for a contract with a specific status
     */
    @Query("SELECT t FROM TimeEntry t WHERE t.contract.id = :contractId AND t.status = :status")
    List<TimeEntry> findByContractIdAndStatus(@Param("contractId") Long contractId, @Param("status") TimeEntryStatus status);

    /**
     * Find time entries for a date range
     */
    @Query("SELECT t FROM TimeEntry t WHERE t.contract.id = :contractId AND t.date BETWEEN :startDate AND :endDate")
    List<TimeEntry> findByContractAndDateRange(
            @Param("contractId") Long contractId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Calculate total hours for a contract (approved entries)
     */
    @Query("SELECT COALESCE(SUM(t.hoursLogged), 0) FROM TimeEntry t WHERE t.contract.id = :contractId AND t.status = 'APPROVED'")
    BigDecimal calculateTotalHoursByContract(@Param("contractId") Long contractId);

    /**
     * Calculate total amount earned for a contract (no ratePerHourCents in new schema)
     */
    @Query("SELECT COALESCE(SUM(t.hoursLogged), 0) FROM TimeEntry t WHERE t.contract.id = :contractId AND t.status = 'APPROVED'")
    BigDecimal calculateTotalEarningsByContract(@Param("contractId") Long contractId);
}
