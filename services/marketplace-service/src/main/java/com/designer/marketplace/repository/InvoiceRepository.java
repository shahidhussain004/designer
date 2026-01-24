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

import com.designer.marketplace.entity.Invoice;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findByPaymentId(Long paymentId);

    Page<Invoice> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

    Page<Invoice> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);

    List<Invoice> findByStatus(InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.company.id = :userId OR i.freelancer.id = :userId ORDER BY i.createdAt DESC")
    Page<Invoice> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :now AND i.status = 'SENT'")
    List<Invoice> findOverdueInvoices(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(@Param("status") InvoiceStatus status);

    @Query("SELECT COALESCE(SUM(i.totalCents), 0) FROM Invoice i WHERE i.status = 'PAID' AND i.invoiceDate BETWEEN :start AND :end")
    Long sumPaidAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT MAX(i.invoiceNumber) FROM Invoice i WHERE :prefix IS NULL OR i.invoiceNumber LIKE CONCAT(:prefix, '%')")
    String findMaxInvoiceNumberWithPrefix(@Param("prefix") String prefix);
}
