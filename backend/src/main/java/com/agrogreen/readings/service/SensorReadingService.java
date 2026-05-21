package com.agrogreen.readings.service;

import com.agrogreen.readings.dto.SensorReadingRequest;
import com.agrogreen.readings.dto.SensorReadingResponse;
import com.agrogreen.readings.entity.SensorReading;
import com.agrogreen.readings.repository.SensorReadingRepository;
import com.agrogreen.sensors.entity.Sensor;
import com.agrogreen.sensors.repository.SensorRepository;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: Service layer for sensor reading business logic.
 */
@Service
@Transactional(readOnly = true)
public class SensorReadingService {

    private final SensorReadingRepository sensorReadingRepository;
    private final SensorRepository sensorRepository;

    public SensorReadingService(SensorReadingRepository sensorReadingRepository, SensorRepository sensorRepository) {
        this.sensorReadingRepository = sensorReadingRepository;
        this.sensorRepository = sensorRepository;
    }

    public List<SensorReadingResponse> findAll() {
        return sensorReadingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SensorReadingResponse findById(Long id) {
        SensorReading reading = sensorReadingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lectura no encontrada con id: " + id));

        return toResponse(reading);
    }

    public List<SensorReadingResponse> findBySensorId(Long sensorId) {
        return sensorReadingRepository.findBySensorIdOrderByReadingDateTimeDesc(sensorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SensorReadingResponse> findBySensorCode(String sensorCode) {
        return sensorReadingRepository.findBySensorCodeOrderByReadingDateTimeDesc(sensorCode)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SensorReadingResponse findLatestBySensorCode(String sensorCode) {
        SensorReading latestReading = sensorReadingRepository.findBySensorCodeOrderByReadingDateTimeDesc(sensorCode)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No hay lecturas registradas para el sensor: " + sensorCode));

        return toResponse(latestReading);
    }

    @Transactional
    public SensorReadingResponse create(SensorReadingRequest request) {
        Sensor sensor = sensorRepository.findByCode(request.getSensorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor no encontrado con código: " + request.getSensorCode()));

        SensorReading reading = new SensorReading();
        reading.setSensor(sensor);
        reading.setValue(request.getValue());
        reading.setReadingDateTime(
                request.getReadingDateTime() != null ? request.getReadingDateTime() : LocalDateTime.now()
        );
        reading.setSource(
                request.getSource() != null ? request.getSource() : "MANUAL"
        );
        reading.setStatus(calculateStatus(sensor, request.getValue()));

        SensorReading savedReading = sensorReadingRepository.save(reading);

        return toResponse(savedReading);
    }

    @Transactional
    public SensorReadingResponse update(Long id, SensorReadingRequest request) {
        SensorReading reading = sensorReadingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lectura no encontrada con id: " + id));

        Sensor sensor = sensorRepository.findByCode(request.getSensorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor no encontrado con código: " + request.getSensorCode()));

        reading.setSensor(sensor);
        reading.setValue(request.getValue());
        reading.setReadingDateTime(
                request.getReadingDateTime() != null ? request.getReadingDateTime() : reading.getReadingDateTime()
        );
        reading.setSource(
                request.getSource() != null ? request.getSource() : reading.getSource()
        );
        reading.setStatus(calculateStatus(sensor, request.getValue()));

        SensorReading updatedReading = sensorReadingRepository.save(reading);

        return toResponse(updatedReading);
    }

    @Transactional
    public void delete(Long id) {
        if (!sensorReadingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lectura no encontrada con id: " + id);
        }

        sensorReadingRepository.deleteById(id);
    }

    private String calculateStatus(Sensor sensor, Double value) {
        if (sensor.getMinValue() != null && value < sensor.getMinValue()) {
            return "OUT_OF_RANGE";
        }

        if (sensor.getMaxValue() != null && value > sensor.getMaxValue()) {
            return "OUT_OF_RANGE";
        }

        return "VALID";
    }

    private SensorReadingResponse toResponse(SensorReading reading) {
        Sensor sensor = reading.getSensor();

        return new SensorReadingResponse(
                reading.getId(),
                sensor.getId(),
                sensor.getCode(),
                sensor.getName(),
                sensor.getZone().getId(),
                sensor.getZone().getName(),
                sensor.getType(),
                sensor.getUnit(),
                reading.getValue(),
                reading.getReadingDateTime(),
                reading.getSource(),
                reading.getStatus(),
                reading.getCreatedAt()
        );
    }
}
