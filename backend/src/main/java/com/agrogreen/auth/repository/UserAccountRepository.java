package com.agrogreen.auth.repository;

import com.agrogreen.auth.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Repository for user account database operations.
 */
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}