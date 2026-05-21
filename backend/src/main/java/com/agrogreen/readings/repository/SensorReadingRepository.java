package com.agrogreen.readings.repository;

import com.agrogreen.readings.entity.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: Repository for sensor reading database operations.
 */
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {

    List<SensorReading> findBySensorIdOrderByReadingDateTimeDesc(Long sensorId);

    List<SensorReading> findTop5ByOrderByReadingDateTimeDesc();

    @Query("SELECT r FROM SensorReading r JOIN r.sensor s WHERE s.code = :sensorCode ORDER BY r.readingDateTime DESC")
    List<SensorReading> findBySensorCodeOrderByReadingDateTimeDesc(@Param("sensorCode") String sensorCode);
}