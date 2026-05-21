package com.agrogreen.dashboard.service;

import com.agrogreen.actuators.entity.Actuator;
import com.agrogreen.actuators.repository.ActuatorRepository;
import com.agrogreen.alerts.entity.Alert;
import com.agrogreen.alerts.repository.AlertRepository;
import com.agrogreen.automation.entity.AutomationRule;
import com.agrogreen.automation.repository.AutomationRuleRepository;
import com.agrogreen.crops.repository.CropRepository;
import com.agrogreen.dashboard.dto.DashboardAlertResponse;
import com.agrogreen.dashboard.dto.DashboardLatestReadingResponse;
import com.agrogreen.dashboard.dto.DashboardSummaryResponse;
import com.agrogreen.greenhouse.repository.GreenhouseRepository;
import com.agrogreen.readings.entity.SensorReading;
import com.agrogreen.readings.repository.SensorReadingRepository;
import com.agrogreen.sensors.entity.Sensor;
import com.agrogreen.sensors.repository.SensorRepository;
import com.agrogreen.zones.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Dashboard
 * Description: Service layer for dashboard summary data.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final GreenhouseRepository greenhouseRepository;
    private final ZoneRepository zoneRepository;
    private final CropRepository cropRepository;
    private final SensorRepository sensorRepository;
    private final ActuatorRepository actuatorRepository;
    private final AutomationRuleRepository automationRuleRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final AlertRepository alertRepository;

    public DashboardService(
            GreenhouseRepository greenhouseRepository,
            ZoneRepository zoneRepository,
            CropRepository cropRepository,
            SensorRepository sensorRepository,
            ActuatorRepository actuatorRepository,
            AutomationRuleRepository automationRuleRepository,
            SensorReadingRepository sensorReadingRepository,
            AlertRepository alertRepository
    ) {
        this.greenhouseRepository = greenhouseRepository;
        this.zoneRepository = zoneRepository;
        this.cropRepository = cropRepository;
        this.sensorRepository = sensorRepository;
        this.actuatorRepository = actuatorRepository;
        this.automationRuleRepository = automationRuleRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.alertRepository = alertRepository;
    }

    public DashboardSummaryResponse getSummary() {
        List<Sensor> sensors = sensorRepository.findAll();
        List<Actuator> actuators = actuatorRepository.findAll();
        List<AutomationRule> automationRules = automationRuleRepository.findAll();
        List<Alert> openAlerts = alertRepository.findByStatusOrderByCreatedAtDesc("OPEN");

        List<DashboardLatestReadingResponse> latestReadings = sensorReadingRepository
                .findTop5ByOrderByReadingDateTimeDesc()
                .stream()
                .map(this::toLatestReadingResponse)
                .toList();

        List<DashboardAlertResponse> latestAlerts = openAlerts
                .stream()
                .limit(5)
                .map(this::toAlertResponse)
                .toList();

        return new DashboardSummaryResponse(
                LocalDateTime.now(),
                greenhouseRepository.count(),
                zoneRepository.count(),
                cropRepository.count(),
                sensors.size(),
                countActiveSensors(sensors),
                actuators.size(),
                countActuatorsOn(actuators),
                automationRules.size(),
                countActiveAutomationRules(automationRules),
                openAlerts.size(),
                latestReadings,
                latestAlerts
        );
    }

    private long countActiveSensors(List<Sensor> sensors) {
        return sensors.stream()
                .filter(sensor -> "ACTIVE".equalsIgnoreCase(sensor.getStatus()))
                .count();
    }

    private long countActuatorsOn(List<Actuator> actuators) {
        return actuators.stream()
                .filter(actuator -> "ON".equalsIgnoreCase(actuator.getState()))
                .count();
    }

    private long countActiveAutomationRules(List<AutomationRule> automationRules) {
        return automationRules.stream()
                .filter(rule -> "ACTIVE".equalsIgnoreCase(rule.getStatus()))
                .count();
    }

    private DashboardLatestReadingResponse toLatestReadingResponse(SensorReading reading) {
        Sensor sensor = reading.getSensor();

        return new DashboardLatestReadingResponse(
                reading.getId(),
                sensor.getCode(),
                sensor.getName(),
                sensor.getZone().getName(),
                sensor.getType(),
                reading.getValue(),
                sensor.getUnit(),
                reading.getStatus(),
                reading.getReadingDateTime()
        );
    }

    private DashboardAlertResponse toAlertResponse(Alert alert) {
        Sensor sensor = alert.getSensor();

        return new DashboardAlertResponse(
                alert.getId(),
                sensor.getCode(),
                sensor.getName(),
                sensor.getZone().getName(),
                alert.getType(),
                alert.getLevel(),
                alert.getMessage(),
                alert.getStatus(),
                alert.getCreatedAt()
        );
    }
}