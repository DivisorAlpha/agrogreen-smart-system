package com.agrogreen.readings.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: DTO used to send sensor reading data to the client.
 */
public class SensorReadingResponse {

    private Long id;
    private Long sensorId;
    private String sensorCode;
    private String sensorName;
    private Long zoneId;
    private String zoneName;
    private String type;
    private String unit;
    private Double value;
    private LocalDateTime readingDateTime;
    private String source;
    private String status;
    private LocalDateTime createdAt;

    public SensorReadingResponse() {
    }

    public SensorReadingResponse(Long id, Long sensorId, String sensorCode, String sensorName, Long zoneId, String zoneName, String type, String unit, Double value, LocalDateTime readingDateTime, String source, String status, LocalDateTime createdAt) {
        this.id = id;
        this.sensorId = sensorId;
        this.sensorCode = sensorCode;
        this.sensorName = sensorName;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.type = type;
        this.unit = unit;
        this.value = value;
        this.readingDateTime = readingDateTime;
        this.source = source;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getSensorId() {
        return sensorId;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public String getSensorName() {
        return sensorName;
    }

    public Long getZoneId() {
        return zoneId;
    }

    public String getZoneName() {
        return zoneName;
    }

    public String getType() {
        return type;
    }

    public String getUnit() {
        return unit;
    }

    public Double getValue() {
        return value;
    }

    public LocalDateTime getReadingDateTime() {
        return readingDateTime;
    }

    public String getSource() {
        return source;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}