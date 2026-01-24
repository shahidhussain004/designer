package com.designer.marketplace.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Payment.EscrowStatus;
import com.designer.marketplace.entity.Payment.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentIntentId(String paymentIntentId);

    List<Payment> findByCompanyId(Long companyId);

    List<Payment> findByFreelancerId(Long freelancerId);

    List<Payment> findByProjectId(Long projectId);

    Page<Payment> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    Page<Payment> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.company.id = :userId OR p.freelancer.id = :userId ORDER BY p.createdAt DESC")
    Page<Payment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT SUM(p.amountCents) FROM Payment p WHERE p.freelancer.id = :freelancerId AND p.status = 'SUCCEEDED'")
    Long sumAmountByFreelancerId(@Param("freelancerId") Long freelancerId);

    @Query("SELECT SUM(p.platformFeeCents) FROM Payment p WHERE p.status = 'SUCCEEDED' AND p.createdAt BETWEEN :start AND :end")
    Long sumPlatformFeeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentStatus status);

    // Admin dashboard queries
    @Query("SELECT COALESCE(SUM(p.amountCents), 0) FROM Payment p WHERE p.status = 'SUCCEEDED'")
    BigDecimal sumTotalAmount();

    @Query("SELECT COALESCE(SUM(p.amountCents), 0) FROM Payment p WHERE p.status = 'SUCCEEDED' AND p.createdAt > :date")
    BigDecimal sumTotalAmountAfter(@Param("date") LocalDateTime date);

    @Query("SELECT COALESCE(SUM(p.platformFeeCents), 0) FROM Payment p WHERE p.status = 'SUCCEEDED'")
    BigDecimal sumPlatformFees();

    @Query("SELECT COALESCE(SUM(p.freelancerAmountCents), 0) FROM Payment p WHERE p.freelancer.id = :freelancerId AND p.escrowStatus = :escrowStatus")
    Long sumFreelancerAmountByFreelancerIdAndEscrowStatus(@Param("freelancerId") Long freelancerId,
            @Param("escrowStatus") EscrowStatus escrowStatus);
}
