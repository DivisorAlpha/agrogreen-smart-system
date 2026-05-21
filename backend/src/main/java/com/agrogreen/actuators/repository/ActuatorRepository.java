package com.agrogreen.actuators.repository;

import com.agrogreen.actuators.entity.Actuator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: Repository for actuator database operations.
 */
public interface ActuatorRepository extends JpaRepository<Actuator, Long> {

    List<Actuator> findByZoneId(Long zoneId);

    Optional<Actuator> findByCode(String code);

    boolean existsByCode(String code);
}