package com.agrogreen.sensors.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Sensors
 * Description: DTO used to send sensor data to the client.
 */
public class SensorResponse {

    private Long id;
    private Long zoneId;
    private String zoneName;
    private String code;
    private String name;
    private String type;
    private String unit;
    private Double minValue;
    private Double maxValue;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SensorResponse() {
    }

    public SensorResponse(Long id, Long zoneId, String zoneName, String code, String name, String type, String unit, Double minValue, Double maxValue, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.code = code;
        this.name = name;
        this.type = type;
        this.unit = unit;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getZoneId() {
        return zoneId;
    }

    public String getZoneName() {
        return zoneName;
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
