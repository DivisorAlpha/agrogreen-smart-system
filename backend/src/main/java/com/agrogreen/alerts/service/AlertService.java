package com.agrogreen.alerts.service;

import com.agrogreen.alerts.dto.AlertRequest;
import com.agrogreen.alerts.dto.AlertResponse;
import com.agrogreen.alerts.entity.Alert;
import com.agrogreen.alerts.repository.AlertRepository;
import com.agrogreen.readings.entity.SensorReading;
import com.agrogreen.sensors.entity.Sensor;
import com.agrogreen.sensors.repository.SensorRepository;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Alerts
 * Description: Service layer for alert business logic.
 */
@Service
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;
    private final SensorRepository sensorRepository;

    public AlertService(AlertRepository alertRepository, SensorRepository sensorRepository) {
        this.alertRepository = alertRepository;
        this.sensorRepository = sensorRepository;
    }

    public List<AlertResponse> findAll() {
        return alertRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AlertResponse findById(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada con id: " + id));

        return toResponse(alert);
    }

    public List<AlertResponse> findByStatus(String status) {
        return alertRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AlertResponse> findBySensorCode(String sensorCode) {
        return alertRepository.findBySensorCode(sensorCode)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AlertResponse> findOpenBySensorCode(String sensorCode) {
        return alertRepository.findOpenBySensorCode(sensorCode)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AlertResponse create(AlertRequest request) {
        Sensor sensor = sensorRepository.findByCode(request.getSensorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor no encontrado con código: " + request.getSensorCode()));

        Alert alert = new Alert();
        alert.setSensor(sensor);
        alert.setType(request.getType().toUpperCase());
        alert.setLevel(request.getLevel().toUpperCase());
        alert.setMessage(request.getMessage());
        alert.setStatus("OPEN");

        Alert savedAlert = alertRepository.save(alert);

        return toResponse(savedAlert);
    }

    @Transactional
    public AlertResponse createFromSensorReading(SensorReading reading) {
        if (!"OUT_OF_RANGE".equalsIgnoreCase(reading.getStatus())) {
            return null;
        }

        Sensor sensor = reading.getSensor();

        Alert alert = new Alert();
        alert.setSensor(sensor);
        alert.setType(sensor.getType());
        alert.setLevel("WARNING");
        alert.setMessage(
                "La lectura " + reading.getValue() + " " + sensor.getUnit() +
                        " está fuera del rango permitido para el sensor " + sensor.getCode() + "."
        );
        alert.setStatus("OPEN");

        Alert savedAlert = alertRepository.save(alert);

        return toResponse(savedAlert);
    }

    @Transactional
    public AlertResponse resolve(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada con id: " + id));

        alert.setStatus("RESOLVED");
        alert.setResolvedAt(LocalDateTime.now());

        Alert resolvedAlert = alertRepository.save(alert);

        return toResponse(resolvedAlert);
    }

    @Transactional
    public void delete(Long id) {
        if (!alertRepository.existsById(id)) {
            throw new ResourceNotFoundException("Alerta no encontrada con id: " + id);
        }

        alertRepository.deleteById(id);
    }

    private AlertResponse toResponse(Alert alert) {
        Sensor sensor = alert.getSensor();

        return new AlertResponse(
                alert.getId(),
                sensor.getCode(),
                sensor.getName(),
                sensor.getZone().getId(),
                sensor.getZone().getName(),
                alert.getType(),
                alert.getLevel(),
                alert.getMessage(),
                alert.getStatus(),
                alert.getCreatedAt(),
                alert.getResolvedAt()
        );
    }
}