package com.agrogreen.readings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: DTO used to receive sensor reading data from the client.
 */
public class SensorReadingRequest {

    @NotBlank(message = "El código del sensor es obligatorio")
    @Size(max = 60, message = "El código del sensor no puede superar los 60 caracteres")
    private String sensorCode;

    @NotNull(message = "El valor de la lectura es obligatorio")
    private Double value;

    private LocalDateTime readingDateTime;

    @Size(max = 30, message = "La fuente no puede superar los 30 caracteres")
    private String source;

    public SensorReadingRequest() {
    }

    public String getSensorCode() {
        return sensorCode;
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

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
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
}