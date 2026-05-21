package com.agrogreen.automation.repository;

import com.agrogreen.automation.entity.AutomationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: Repository for automation rule database operations.
 */
public interface AutomationRuleRepository extends JpaRepository<AutomationRule, Long> {

    @Query("SELECT r FROM AutomationRule r JOIN r.sensor s WHERE s.code = :sensorCode ORDER BY r.id DESC")
    List<AutomationRule> findBySensorCode(@Param("sensorCode") String sensorCode);

    @Query("SELECT r FROM AutomationRule r JOIN r.sensor s WHERE s.code = :sensorCode AND r.status = 'ACTIVE'")
    List<AutomationRule> findActiveBySensorCode(@Param("sensorCode") String sensorCode);
}
