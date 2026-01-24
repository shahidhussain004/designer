package com.designer.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Payout;
import com.designer.marketplace.entity.Payout.PayoutStatus;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {

    Optional<Payout> findByPayoutReference(String payoutReference);

    Optional<Payout> findByStripeTransferId(String stripeTransferId);

    Optional<Payout> findByStripePayoutId(String stripePayoutId);

    Page<Payout> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);

    List<Payout> findByStatus(PayoutStatus status);

    List<Payout> findByFreelancerIdAndStatus(Long freelancerId, PayoutStatus status);

    @Query("SELECT p FROM Payout p WHERE p.status IN :statuses ORDER BY p.createdAt ASC")
    List<Payout> findByStatusIn(@Param("statuses") List<PayoutStatus> statuses);

    @Query("SELECT COUNT(p) FROM Payout p WHERE p.status = :status")
    long countByStatus(@Param("status") PayoutStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.freelancer.id = :freelancerId AND p.status = 'PAID'")
    Long sumPaidAmountByFreelancerId(@Param("freelancerId") Long freelancerId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payout p WHERE p.status = 'PAID' AND p.completedAt BETWEEN :start AND :end")
    Long sumPaidAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payout p WHERE p.freelancer.id = :freelancerId AND p.status = 'PAID' ORDER BY p.completedAt DESC")
    Page<Payout> findPaidPayoutsByFreelancerId(@Param("freelancerId") Long freelancerId, Pageable pageable);

    @Query("SELECT MAX(p.payoutReference) FROM Payout p WHERE :prefix IS NULL OR p.payoutReference LIKE CONCAT(:prefix, '%')")
    String findMaxPayoutReferenceWithPrefix(@Param("prefix") String prefix);

    @Query("SELECT p FROM Payout p WHERE p.status = 'PROCESSING' AND p.initiatedAt < :timeout")
    List<Payout> findStuckPayouts(@Param("timeout") LocalDateTime timeout);
}
