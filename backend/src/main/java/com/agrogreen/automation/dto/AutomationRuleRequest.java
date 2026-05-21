package com.agrogreen.automation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: DTO used to create or update automation rules.
 */
public class AutomationRuleRequest {

    @NotBlank(message = "El nombre de la regla es obligatorio")
    @Size(max = 160, message = "El nombre no puede superar los 160 caracteres")
    private String name;

    @NotBlank(message = "El código del sensor es obligatorio")
    @Size(max = 60, message = "El código del sensor no puede superar los 60 caracteres")
    private String sensorCode;

    @NotBlank(message = "El operador es obligatorio")
    @Size(max = 10, message = "El operador no puede superar los 10 caracteres")
    private String operator;

    @NotNull(message = "El valor umbral es obligatorio")
    private Double thresholdValue;

    @NotBlank(message = "El código del actuador es obligatorio")
    @Size(max = 60, message = "El código del actuador no puede superar los 60 caracteres")
    private String actuatorCode;

    @NotBlank(message = "El comando es obligatorio")
    @Size(max = 30, message = "El comando no puede superar los 30 caracteres")
    private String command;

    public AutomationRuleRequest() {
    }

    public String getName() {
        return name;
    }

    public String getSensorCode() {
        return sensorCode;
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

    public String getCommand() {
        return command;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public void setThresholdValue(Double thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public void setActuatorCode(String actuatorCode) {
        this.actuatorCode = actuatorCode;
    }

    public void setCommand(String command) {
        this.command = command;
    }
}