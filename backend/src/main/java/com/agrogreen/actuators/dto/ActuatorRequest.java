package com.agrogreen.actuators.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: DTO used to receive actuator data from the client.
 */
public class ActuatorRequest {

    @NotNull(message = "El id de la zona es obligatorio")
    private Long zoneId;

    @NotBlank(message = "El código del actuador es obligatorio")
    @Size(max = 60, message = "El código no puede superar los 60 caracteres")
    private String code;

    @NotBlank(message = "El nombre del actuador es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar los 120 caracteres")
    private String name;

    @NotBlank(message = "El tipo de actuador es obligatorio")
    @Size(max = 60, message = "El tipo no puede superar los 60 caracteres")
    private String type;

    @Size(max = 20, message = "El estado no puede superar los 20 caracteres")
    private String state;

    @Size(max = 30, message = "El estado operacional no puede superar los 30 caracteres")
    private String operationalStatus;

    public ActuatorRequest() {
    }

    public Long getZoneId() {
        return zoneId;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getState() {
        return state;
    }

    public String getOperationalStatus() {
        return operationalStatus;
    }

    public void setZoneId(Long zoneId) {
        this.zoneId = zoneId;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setOperationalStatus(String operationalStatus) {
        this.operationalStatus = operationalStatus;
    }
}
