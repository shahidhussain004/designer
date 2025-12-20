package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Escrow;
import com.designer.marketplace.entity.Escrow.EscrowHoldStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EscrowRepository extends JpaRepository<Escrow, Long> {
    
    Optional<Escrow> findByPaymentId(Long paymentId);
    
    List<Escrow> findByJobId(Long jobId);
    
    List<Escrow> findByStatus(EscrowHoldStatus status);
    
    @Query("SELECT e FROM Escrow e WHERE e.status = 'HELD' AND e.autoReleaseDate <= :date")
    List<Escrow> findEscrowsToAutoRelease(@Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(e.amount) FROM Escrow e WHERE e.status = 'HELD'")
    Long sumHeldAmount();
}
