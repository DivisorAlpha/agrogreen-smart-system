package com.agrogreen.sensors.service;

import com.agrogreen.sensors.dto.SensorRequest;
import com.agrogreen.sensors.dto.SensorResponse;
import com.agrogreen.sensors.entity.Sensor;
import com.agrogreen.sensors.repository.SensorRepository;
import com.agrogreen.zones.entity.Zone;
import com.agrogreen.zones.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Sensors
 * Description: Service layer for sensor business logic.
 */
@Service
@Transactional(readOnly = true)
public class SensorService {

    private final SensorRepository sensorRepository;
    private final ZoneRepository zoneRepository;

    public SensorService(SensorRepository sensorRepository, ZoneRepository zoneRepository) {
        this.sensorRepository = sensorRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<SensorResponse> findAll() {
        return sensorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SensorResponse findById(Long id) {
        Sensor sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor no encontrado con id: " + id));

        return toResponse(sensor);
    }

    public SensorResponse findByCode(String code) {
        Sensor sensor = sensorRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Sensor no encontrado con código: " + code));

        return toResponse(sensor);
    }

    public List<SensorResponse> findByZoneId(Long zoneId) {
        return sensorRepository.findByZoneId(zoneId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SensorResponse create(SensorRequest request) {
        if (sensorRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Ya existe un sensor con el código: " + request.getCode());
        }

        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + request.getZoneId()));

        Sensor sensor = new Sensor();
        sensor.setZone(zone);
        sensor.setCode(request.getCode());
        sensor.setName(request.getName());
        sensor.setType(request.getType());
        sensor.setUnit(request.getUnit());
        sensor.setMinValue(request.getMinValue());
        sensor.setMaxValue(request.getMaxValue());
        sensor.setStatus("ACTIVE");

        Sensor savedSensor = sensorRepository.save(sensor);

        return toResponse(savedSensor);
    }

    @Transactional
    public SensorResponse update(Long id, SensorRequest request) {
        Sensor sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor no encontrado con id: " + id));

        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + request.getZoneId()));

        sensor.setZone(zone);
        sensor.setCode(request.getCode());
        sensor.setName(request.getName());
        sensor.setType(request.getType());
        sensor.setUnit(request.getUnit());
        sensor.setMinValue(request.getMinValue());
        sensor.setMaxValue(request.getMaxValue());

        Sensor updatedSensor = sensorRepository.save(sensor);

        return toResponse(updatedSensor);
    }

    @Transactional
    public void delete(Long id) {
        if (!sensorRepository.existsById(id)) {
            throw new RuntimeException("Sensor no encontrado con id: " + id);
        }

        sensorRepository.deleteById(id);
    }

    private SensorResponse toResponse(Sensor sensor) {
        return new SensorResponse(
                sensor.getId(),
                sensor.getZone().getId(),
                sensor.getZone().getName(),
                sensor.getCode(),
                sensor.getName(),
                sensor.getType(),
                sensor.getUnit(),
                sensor.getMinValue(),
                sensor.getMaxValue(),
                sensor.getStatus(),
                sensor.getCreatedAt(),
                sensor.getUpdatedAt()
        );
    }
}
