package com.agrogreen.automation.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: DTO used to send automation rule data to the client.
 */
public class AutomationRuleResponse {

    private Long id;
    private String name;
    private String sensorCode;
    private String sensorName;
    private String operator;
    private Double thresholdValue;
    private String actuatorCode;
    private String actuatorName;
    private String command;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AutomationRuleResponse() {
    }

    public AutomationRuleResponse(
            Long id,
            String name,
            String sensorCode,
            String sensorName,
            String operator,
            Double thresholdValue,
            String actuatorCode,
            String actuatorName,
            String command,
            String status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.sensorCode = sensorCode;
        this.sensorName = sensorName;
        this.operator = operator;
        this.thresholdValue = thresholdValue;
        this.actuatorCode = actuatorCode;
        this.actuatorName = actuatorName;
        this.command = command;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public String getSensorName() {
        return sensorName;
    }

    public String getOperator() {
        return operator;
    }

    public Double getThresholdValue() {
        return thresholdValue;
    }

    public String getActuatorCode() {
        return actuatorCode;
    }

    public String getActuatorName() {
        return actuatorName;
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
}
