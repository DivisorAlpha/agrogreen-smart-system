package com.agrogreen.alerts.repository;

import com.agrogreen.alerts.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Alerts
 * Description: Repository for alert database operations.
 */
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT a FROM Alert a JOIN a.sensor s WHERE s.code = :sensorCode ORDER BY a.createdAt DESC")
    List<Alert> findBySensorCode(@Param("sensorCode") String sensorCode);

    @Query("SELECT a FROM Alert a JOIN a.sensor s WHERE s.code = :sensorCode AND a.status = 'OPEN' ORDER BY a.createdAt DESC")
    List<Alert> findOpenBySensorCode(@Param("sensorCode") String sensorCode);
}
