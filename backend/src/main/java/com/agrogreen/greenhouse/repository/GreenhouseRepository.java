package com.agrogreen.greenhouse.repository;

import com.agrogreen.greenhouse.entity.Greenhouse;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Project: AgroGreen Smart System
 * Module: Greenhouse
 * Description: Repository for greenhouse database operations.
 */
public interface GreenhouseRepository extends JpaRepository<Greenhouse, Long> {
}
