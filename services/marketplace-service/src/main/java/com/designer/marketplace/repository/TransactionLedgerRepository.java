package com.designer.marketplace.repository;

import com.designer.marketplace.entity.TransactionLedger;
import com.designer.marketplace.entity.TransactionLedger.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionLedgerRepository extends JpaRepository<TransactionLedger, Long> {
    
    List<TransactionLedger> findByPaymentId(Long paymentId);
    
    Page<TransactionLedger> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<TransactionLedger> findByTransactionType(TransactionType type);
    
    List<TransactionLedger> findByReferenceId(String referenceId);
}
