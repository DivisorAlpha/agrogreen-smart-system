package com.agrogreen.greenhouse.dto;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Greenhouse
 * Description: DTO used to send greenhouse data to the client.
 */
public class GreenhouseResponse {

    private Long id;
    private String name;
    private String location;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GreenhouseResponse() {
    }

    public GreenhouseResponse(Long id, String name, String location, String description, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
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

    public String getLocation() {
        return location;
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