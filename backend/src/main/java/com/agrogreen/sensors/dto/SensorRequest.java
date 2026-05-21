package com.agrogreen.sensors.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Sensors
 * Description: DTO used to receive sensor data from the client.
 */
public class SensorRequest {

    @NotNull(message = "El id de la zona es obligatorio")
    private Long zoneId;

    @NotBlank(message = "El código del sensor es obligatorio")
    @Size(max = 60, message = "El código no puede superar los 60 caracteres")
    private String code;

    @NotBlank(message = "El nombre del sensor es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar los 120 caracteres")
    private String name;

    @NotBlank(message = "El tipo de sensor es obligatorio")
    @Size(max = 60, message = "El tipo no puede superar los 60 caracteres")
    private String type;

    @NotBlank(message = "La unidad de medida es obligatoria")
    @Size(max = 20, message = "La unidad no puede superar los 20 caracteres")
    private String unit;

    private Double minValue;

    private Double maxValue;

    public SensorRequest() {
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

    public String getUnit() {
        return unit;
    }

    public Double getMinValue() {
        return minValue;
    }

    public Double getMaxValue() {
        return maxValue;
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

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public void setMinValue(Double minValue) {
        this.minValue = minValue;
    }

    public void setMaxValue(Double maxValue) {
        this.maxValue = maxValue;
    }
}
