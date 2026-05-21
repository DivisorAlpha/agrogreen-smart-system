package com.agrogreen.alerts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Alerts
 * Description: DTO used to create alerts manually.
 */
public class AlertRequest {

    @NotBlank(message = "El código del sensor es obligatorio")
    @Size(max = 60, message = "El código del sensor no puede superar los 60 caracteres")
    private String sensorCode;

    @NotBlank(message = "El tipo de alerta es obligatorio")
    @Size(max = 60, message = "El tipo no puede superar los 60 caracteres")
    private String type;

    @NotBlank(message = "El nivel de alerta es obligatorio")
    @Size(max = 30, message = "El nivel no puede superar los 30 caracteres")
    private String level;

    @NotBlank(message = "El mensaje de la alerta es obligatorio")
    @Size(max = 500, message = "El mensaje no puede superar los 500 caracteres")
    private String message;

    public AlertRequest() {
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public String getType() {
        return type;
    }

    public String getLevel() {
        return level;
    }

    public String getMessage() {
        return message;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}