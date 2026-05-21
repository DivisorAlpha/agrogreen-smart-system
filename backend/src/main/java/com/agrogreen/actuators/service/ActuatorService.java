package com.agrogreen.actuators.service;

import com.agrogreen.actuators.dto.ActuatorCommandRequest;
import com.agrogreen.actuators.dto.ActuatorRequest;
import com.agrogreen.actuators.dto.ActuatorResponse;
import com.agrogreen.actuators.entity.Actuator;
import com.agrogreen.actuators.repository.ActuatorRepository;
import com.agrogreen.shared.exception.BusinessException;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import com.agrogreen.zones.entity.Zone;
import com.agrogreen.zones.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: Service layer for actuator business logic.
 */
@Service
@Transactional(readOnly = true)
public class ActuatorService {

    private final ActuatorRepository actuatorRepository;
    private final ZoneRepository zoneRepository;

    public ActuatorService(ActuatorRepository actuatorRepository, ZoneRepository zoneRepository) {
        this.actuatorRepository = actuatorRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<ActuatorResponse> findAll() {
        return actuatorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ActuatorResponse findById(Long id) {
        Actuator actuator = actuatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con id: " + id));

        return toResponse(actuator);
    }

    public ActuatorResponse findByCode(String code) {
        Actuator actuator = actuatorRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con código: " + code));

        return toResponse(actuator);
    }

    public List<ActuatorResponse> findByZoneId(Long zoneId) {
        return actuatorRepository.findByZoneId(zoneId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ActuatorResponse create(ActuatorRequest request) {
        if (actuatorRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Ya existe un actuador con el código: " + request.getCode());
        }

        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada con id: " + request.getZoneId()));

        Actuator actuator = new Actuator();
        actuator.setZone(zone);
        actuator.setCode(request.getCode());
        actuator.setName(request.getName());
        actuator.setType(request.getType());
        actuator.setState(request.getState() != null ? request.getState() : "OFF");
        actuator.setOperationalStatus(request.getOperationalStatus() != null ? request.getOperationalStatus() : "ACTIVE");

        Actuator savedActuator = actuatorRepository.save(actuator);

        return toResponse(savedActuator);
    }

    @Transactional
    public ActuatorResponse update(Long id, ActuatorRequest request) {
        Actuator actuator = actuatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con id: " + id));

        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada con id: " + request.getZoneId()));

        actuator.setZone(zone);
        actuator.setCode(request.getCode());
        actuator.setName(request.getName());
        actuator.setType(request.getType());
        actuator.setState(request.getState() != null ? request.getState() : actuator.getState());
        actuator.setOperationalStatus(
                request.getOperationalStatus() != null ? request.getOperationalStatus() : actuator.getOperationalStatus()
        );

        Actuator updatedActuator = actuatorRepository.save(actuator);

        return toResponse(updatedActuator);
    }

    @Transactional
    public ActuatorResponse executeCommand(String code, ActuatorCommandRequest request) {
        Actuator actuator = actuatorRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con código: " + code));

        if (!"ACTIVE".equalsIgnoreCase(actuator.getOperationalStatus())) {
            throw new BusinessException("El actuador no está activo. Estado actual: " + actuator.getOperationalStatus());
        }

        String command = request.getCommand().toUpperCase();

        switch (command) {
            case "TURN_ON" -> actuator.setState("ON");
            case "TURN_OFF" -> actuator.setState("OFF");
            case "TOGGLE" -> actuator.setState("ON".equalsIgnoreCase(actuator.getState()) ? "OFF" : "ON");
            default -> throw new BusinessException("Comando no soportado: " + request.getCommand());
        }

        actuator.setLastCommandAt(LocalDateTime.now());

        Actuator updatedActuator = actuatorRepository.save(actuator);

        return toResponse(updatedActuator);
    }

    @Transactional
    public void delete(Long id) {
        if (!actuatorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Actuador no encontrado con id: " + id);
        }

        actuatorRepository.deleteById(id);
    }

    private ActuatorResponse toResponse(Actuator actuator) {
        return new ActuatorResponse(
                actuator.getId(),
                actuator.getZone().getId(),
                actuator.getZone().getName(),
                actuator.getCode(),
                actuator.getName(),
                actuator.getType(),
                actuator.getState(),
                actuator.getOperationalStatus(),
                actuator.getLastCommandAt(),
                actuator.getCreatedAt(),
                actuator.getUpdatedAt()
        );
    }
}