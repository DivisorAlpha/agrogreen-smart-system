package com.agrogreen.automation.entity;

import com.agrogreen.actuators.entity.Actuator;
import com.agrogreen.sensors.entity.Sensor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: Entity that represents an automation rule between a sensor and an actuator.
 */
@Entity
@Table(name = "automation_rules")
public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_id", nullable = false)
    private Sensor sensor;

    @Column(nullable = false, length = 10)
    private String operator;

    @Column(name = "threshold_value", nullable = false)
    private Double thresholdValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actuator_id", nullable = false)
    private Actuator actuator;

    @Column(nullable = false, length = 30)
    private String command;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public AutomationRule() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Sensor getSensor() {
        return sensor;
    }

    public String getOperator() {
        return operator;
    }

    public Double getThresholdValue() {
        return thresholdValue;
    }

    public Actuator getActuator() {
        return actuator;
    }

    public String getCommand() {
        return command;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public void setThresholdValue(Double thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public void setActuator(Actuator actuator) {
        this.actuator = actuator;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}