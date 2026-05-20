package com.agrogreen.zones.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Zones
 * Description: DTO used to send zone data to the client.
 */
public class ZoneResponse {

    private Long id;
    private Long greenhouseId;
    private String greenhouseName;
    private String name;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ZoneResponse() {
    }

    public ZoneResponse(Long id, Long greenhouseId, String greenhouseName, String name, String description, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.greenhouseId = greenhouseId;
        this.greenhouseName = greenhouseName;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getGreenhouseId() {
        return greenhouseId;
    }

    public String getGreenhouseName() {
        return greenhouseName;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
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
