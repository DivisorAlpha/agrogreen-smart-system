package com.agrogreen.crops.entity;

import com.agrogreen.zones.entity.Zone;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: Entity that represents a crop planted inside a greenhouse zone.
 */
@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Relationship:
     * Many crops can belong to one zone.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "scientific_name", length = 160)
    private String scientificName;

    @Column(name = "planting_date")
    private LocalDate plantingDate;

    @Column(name = "estimated_harvest_date")
    private LocalDate estimatedHarvestDate;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Crop() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = "GROWING";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Zone getZone() {
        return zone;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
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

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}