package com.designer.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUserId(Long userId);
    @Query("select c from Company c left join fetch c.user where c.id = :id")
    Optional<Company> findByIdWithUser(@org.springframework.data.repository.query.Param("id") Long id);
}
