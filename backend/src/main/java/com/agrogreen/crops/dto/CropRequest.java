package com.agrogreen.crops.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: DTO used to receive crop data from the client.
 */
public class CropRequest {

    @NotNull(message = "El id de la zona es obligatorio")
    private Long zoneId;

    @NotBlank(message = "El nombre del cultivo es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar los 120 caracteres")
    private String name;

    @Size(max = 160, message = "El nombre científico no puede superar los 160 caracteres")
    private String scientificName;

    private LocalDate plantingDate;

    private LocalDate estimatedHarvestDate;

    public CropRequest() {
    }

    public Long getZoneId() {
        return zoneId;
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

    public void setZoneId(Long zoneId) {
        this.zoneId = zoneId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public void setEstimatedHarvestDate(LocalDate estimatedHarvestDate) {
        this.estimatedHarvestDate = estimatedHarvestDate;
    }
}