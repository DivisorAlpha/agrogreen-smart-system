package com.agrogreen.sensors.repository;

import com.agrogreen.sensors.entity.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Project: AgroGreen Smart System
 * Module: Sensors
 * Description: Repository for sensor database operations.
 */
public interface SensorRepository extends JpaRepository<Sensor, Long> {

    List<Sensor> findByZoneId(Long zoneId);

    Optional<Sensor> findByCode(String code);

    boolean existsByCode(String code);
}