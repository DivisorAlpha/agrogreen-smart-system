package com.agrogreen.readings.entity;

import com.agrogreen.sensors.entity.Sensor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: Entity that represents a measurement captured by a sensor.
 */
@Entity
@Table(name = "sensor_readings")
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Relationship:
     * Many readings can belong to one sensor.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_id", nullable = false)
    private Sensor sensor;

    @Column(nullable = false)
    private Double value;

    @Column(name = "reading_date_time", nullable = false)
    private LocalDateTime readingDateTime;

    @Column(nullable = false, length = 30)
    private String source;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public SensorReading() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.readingDateTime == null) {
            this.readingDateTime = LocalDateTime.now();
        }

        if (this.source == null) {
            this.source = "MANUAL";
        }

        if (this.status == null) {
            this.status = "VALID";
        }
    }

    public Long getId() {
        return id;
    }

    public Sensor getSensor() {
        return sensor;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public void setReadingDateTime(LocalDateTime readingDateTime) {
        this.readingDateTime = readingDateTime;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}