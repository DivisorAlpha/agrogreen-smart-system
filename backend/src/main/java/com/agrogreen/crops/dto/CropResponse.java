package com.agrogreen.crops.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: DTO used to send crop data to the client.
 */
public class CropResponse {

    private Long id;
    private Long zoneId;
    private String zoneName;
    private String name;
    private String scientificName;
    private LocalDate plantingDate;
    private LocalDate estimatedHarvestDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CropResponse() {
    }

    public CropResponse(Long id, Long zoneId, String zoneName, String name, String scientificName, LocalDate plantingDate, LocalDate estimatedHarvestDate, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.name = name;
        this.scientificName = scientificName;
        this.plantingDate = plantingDate;
        this.estimatedHarvestDate = estimatedHarvestDate;
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

    public String getName() {
        return name;
    }

    public String getScientificName() {
        return scientificName;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public LocalDate getEstimatedHarvestDate() {
        return estimatedHarvestDate;
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