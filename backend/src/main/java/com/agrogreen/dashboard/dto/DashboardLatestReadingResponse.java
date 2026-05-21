package com.agrogreen.dashboard.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Dashboard
 * Description: DTO used to show latest sensor readings in the dashboard.
 */
public class DashboardLatestReadingResponse {

    private Long id;
    private String sensorCode;
    private String sensorName;
    private String zoneName;
    private String type;
    private Double value;
    private String unit;
    private String status;
    private LocalDateTime readingDateTime;

    public DashboardLatestReadingResponse() {
    }

    public DashboardLatestReadingResponse(
            Long id,
            String sensorCode,
            String sensorName,
            String zoneName,
            String type,
            Double value,
            String unit,
            String status,
            LocalDateTime readingDateTime
    ) {
        this.id = id;
        this.sensorCode = sensorCode;
        this.sensorName = sensorName;
        this.zoneName = zoneName;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.status = status;
        this.readingDateTime = readingDateTime;
    }

    public Long getId() {
        return id;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public String getSensorName() {
        return sensorName;
    }

    public String getZoneName() {
        return zoneName;
    }

    public String getType() {
        return type;
    }

    public Double getValue() {
        return value;
    }

    public String getUnit() {
        return unit;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getReadingDateTime() {
        return readingDateTime;
    }
}