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

import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Payment.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByCompanyId(Long companyId);

    List<Payment> findByFreelancerId(Long freelancerId);

    Page<Payment> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    Page<Payment> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.company.id = :userId OR p.freelancer.id = :userId ORDER BY p.createdAt DESC")
    Page<Payment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amountCents), 0) FROM Payment p WHERE p.status = :status")
    Long sumAmountByStatus(@Param("status") PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentStatus status);

    // Admin dashboard queries
    @Query("SELECT COALESCE(SUM(p.amountCents), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    Long sumTotalAmount();

    @Query("SELECT COALESCE(SUM(p.amountCents), 0) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt > :date")
    Long sumTotalAmountAfter(@Param("date") LocalDateTime date);

    // ✅ EAGER LOADING METHODS - Prevent LazyInitializationException
    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.company LEFT JOIN FETCH p.freelancer LEFT JOIN FETCH p.contract WHERE p.id = :id")
    Optional<Payment> findByIdWithRelations(@Param("id") Long id);

    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.company LEFT JOIN FETCH p.freelancer LEFT JOIN FETCH p.contract WHERE p.contract.id = :contractId")
    List<Payment> findByContractIdWithRelations(@Param("contractId") Long contractId);
}
