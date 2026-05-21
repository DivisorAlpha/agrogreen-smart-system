package com.agrogreen.actuators.entity;

import com.agrogreen.zones.entity.Zone;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: Entity that represents a physical device controlled by the system.
 */
@Entity
@Table(name = "actuators")
public class Actuator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Relationship:
     * Many actuators can belong to one zone.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @Column(nullable = false, unique = true, length = 60)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 60)
    private String type;

    @Column(nullable = false, length = 20)
    private String state;

    @Column(name = "operational_status", nullable = false, length = 30)
    private String operationalStatus;

    @Column(name = "last_command_at")
    private LocalDateTime lastCommandAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Actuator() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.state == null) {
            this.state = "OFF";
        }

        if (this.operationalStatus == null) {
            this.operationalStatus = "ACTIVE";
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

    public LocalDateTime getLastCommandAt() {
        return lastCommandAt;
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

    public void setLastCommandAt(LocalDateTime lastCommandAt) {
        this.lastCommandAt = lastCommandAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}