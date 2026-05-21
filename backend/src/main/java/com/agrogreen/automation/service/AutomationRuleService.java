package com.agrogreen.automation.service;

import com.agrogreen.actuators.entity.Actuator;
import com.agrogreen.actuators.repository.ActuatorRepository;
import com.agrogreen.automation.dto.AutomationEvaluationResponse;
import com.agrogreen.automation.dto.AutomationRuleRequest;
import com.agrogreen.automation.dto.AutomationRuleResponse;
import com.agrogreen.automation.entity.AutomationRule;
import com.agrogreen.automation.repository.AutomationRuleRepository;
import com.agrogreen.readings.entity.SensorReading;
import com.agrogreen.readings.repository.SensorReadingRepository;
import com.agrogreen.sensors.entity.Sensor;
import com.agrogreen.sensors.repository.SensorRepository;
import com.agrogreen.shared.exception.BusinessException;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: Service layer for automation rule business logic.
 */
@Service
@Transactional(readOnly = true)
public class AutomationRuleService {

    private final AutomationRuleRepository automationRuleRepository;
    private final SensorRepository sensorRepository;
    private final ActuatorRepository actuatorRepository;
    private final SensorReadingRepository sensorReadingRepository;

    public AutomationRuleService(
            AutomationRuleRepository automationRuleRepository,
            SensorRepository sensorRepository,
            ActuatorRepository actuatorRepository,
            SensorReadingRepository sensorReadingRepository
    ) {
        this.automationRuleRepository = automationRuleRepository;
        this.sensorRepository = sensorRepository;
        this.actuatorRepository = actuatorRepository;
        this.sensorReadingRepository = sensorReadingRepository;
    }

    public List<AutomationRuleResponse> findAll() {
        return automationRuleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AutomationRuleResponse findById(Long id) {
        AutomationRule rule = automationRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regla de automatización no encontrada con id: " + id));

        return toResponse(rule);
    }

    public List<AutomationRuleResponse> findBySensorCode(String sensorCode) {
        return automationRuleRepository.findBySensorCode(sensorCode)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AutomationRuleResponse create(AutomationRuleRequest request) {
        validateOperator(request.getOperator());
        validateCommand(request.getCommand());

        Sensor sensor = sensorRepository.findByCode(request.getSensorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor no encontrado con código: " + request.getSensorCode()));

        Actuator actuator = actuatorRepository.findByCode(request.getActuatorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con código: " + request.getActuatorCode()));

        AutomationRule rule = new AutomationRule();
        rule.setName(request.getName());
        rule.setSensor(sensor);
        rule.setOperator(request.getOperator());
        rule.setThresholdValue(request.getThresholdValue());
        rule.setActuator(actuator);
        rule.setCommand(request.getCommand().toUpperCase());
        rule.setStatus("ACTIVE");

        AutomationRule savedRule = automationRuleRepository.save(rule);

        return toResponse(savedRule);
    }

    @Transactional
    public AutomationRuleResponse update(Long id, AutomationRuleRequest request) {
        validateOperator(request.getOperator());
        validateCommand(request.getCommand());

        AutomationRule rule = automationRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regla de automatización no encontrada con id: " + id));

        Sensor sensor = sensorRepository.findByCode(request.getSensorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor no encontrado con código: " + request.getSensorCode()));

        Actuator actuator = actuatorRepository.findByCode(request.getActuatorCode())
                .orElseThrow(() -> new ResourceNotFoundException("Actuador no encontrado con código: " + request.getActuatorCode()));

        rule.setName(request.getName());
        rule.setSensor(sensor);
        rule.setOperator(request.getOperator());
        rule.setThresholdValue(request.getThresholdValue());
        rule.setActuator(actuator);
        rule.setCommand(request.getCommand().toUpperCase());

        AutomationRule updatedRule = automationRuleRepository.save(rule);

        return toResponse(updatedRule);
    }

    @Transactional
    public AutomationEvaluationResponse evaluateBySensorCode(String sensorCode) {
        SensorReading latestReading = sensorReadingRepository.findBySensorCodeOrderByReadingDateTimeDesc(sensorCode)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No existen lecturas para el sensor: " + sensorCode));

        List<AutomationRule> rules = automationRuleRepository.findActiveBySensorCode(sensorCode);

        List<String> actions = new ArrayList<>();
        int triggered = 0;

        for (AutomationRule rule : rules) {
            boolean conditionMatches = conditionMatches(
                    latestReading.getValue(),
                    rule.getOperator(),
                    rule.getThresholdValue()
            );

            if (conditionMatches) {
                applyCommand(rule.getActuator(), rule.getCommand());
                triggered++;

                actions.add(
                        "Regla '" + rule.getName() + "' ejecutó " +
                                rule.getCommand() + " sobre " +
                                rule.getActuator().getCode()
                );
            }
        }

        return new AutomationEvaluationResponse(
                sensorCode,
                latestReading.getValue(),
                latestReading.getReadingDateTime(),
                rules.size(),
                triggered,
                actions
        );
    }

    @Transactional
    public void delete(Long id) {
        if (!automationRuleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Regla de automatización no encontrada con id: " + id);
        }

        automationRuleRepository.deleteById(id);
    }

    private void validateOperator(String operator) {
        List<String> validOperators = List.of(">", ">=", "<", "<=", "==");

        if (!validOperators.contains(operator)) {
            throw new BusinessException("Operador no soportado: " + operator);
        }
    }

    private void validateCommand(String command) {
        List<String> validCommands = List.of("TURN_ON", "TURN_OFF", "TOGGLE");

        if (!validCommands.contains(command.toUpperCase())) {
            throw new BusinessException("Comando no soportado: " + command);
        }
    }

    private boolean conditionMatches(Double value, String operator, Double threshold) {
        return switch (operator) {
            case ">" -> value > threshold;
            case ">=" -> value >= threshold;
            case "<" -> value < threshold;
            case "<=" -> value <= threshold;
            case "==" -> value.equals(threshold);
            default -> false;
        };
    }

    private void applyCommand(Actuator actuator, String command) {
        if (!"ACTIVE".equalsIgnoreCase(actuator.getOperationalStatus())) {
            throw new BusinessException("El actuador no está activo: " + actuator.getCode());
        }

        switch (command.toUpperCase()) {
            case "TURN_ON" -> actuator.setState("ON");
            case "TURN_OFF" -> actuator.setState("OFF");
            case "TOGGLE" -> actuator.setState("ON".equalsIgnoreCase(actuator.getState()) ? "OFF" : "ON");
            default -> throw new BusinessException("Comando no soportado: " + command);
        }

        actuator.setLastCommandAt(LocalDateTime.now());
        actuatorRepository.save(actuator);
    }

    private AutomationRuleResponse toResponse(AutomationRule rule) {
        return new AutomationRuleResponse(
                rule.getId(),
                rule.getName(),
                rule.getSensor().getCode(),
                rule.getSensor().getName(),
                rule.getOperator(),
                rule.getThresholdValue(),
                rule.getActuator().getCode(),
                rule.getActuator().getName(),
                rule.getCommand(),
                rule.getStatus(),
                rule.getCreatedAt(),
                rule.getUpdatedAt()
        );
    }
}
