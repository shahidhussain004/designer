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

import com.designer.marketplace.entity.User;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
    
    // Admin dashboard queries
    long countByRole(User.UserRole role);
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    // Use a derived query to let JPA/Hibernate handle array mapping correctly
    Page<User> findByRole(User.UserRole role, Pageable pageable);
    
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    
    Page<User> findByRoleAndIsActive(User.UserRole role, boolean isActive, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR (" +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))" +
           "))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(Pageable pageable);
}
