package com.agrogreen.dashboard.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Dashboard
 * Description: DTO used to show a general system summary.
 */
public class DashboardSummaryResponse {

    private LocalDateTime generatedAt;

    private long totalGreenhouses;
    private long totalZones;
    private long totalCrops;

    private long totalSensors;
    private long activeSensors;

    private long totalActuators;
    private long actuatorsOn;

    private long totalAutomationRules;
    private long activeAutomationRules;

    private long openAlerts;

    private List<DashboardLatestReadingResponse> latestReadings;
    private List<DashboardAlertResponse> latestAlerts;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(
            LocalDateTime generatedAt,
            long totalGreenhouses,
            long totalZones,
            long totalCrops,
            long totalSensors,
            long activeSensors,
            long totalActuators,
            long actuatorsOn,
            long totalAutomationRules,
            long activeAutomationRules,
            long openAlerts,
            List<DashboardLatestReadingResponse> latestReadings,
            List<DashboardAlertResponse> latestAlerts
    ) {
        this.generatedAt = generatedAt;
        this.totalGreenhouses = totalGreenhouses;
        this.totalZones = totalZones;
        this.totalCrops = totalCrops;
        this.totalSensors = totalSensors;
        this.activeSensors = activeSensors;
        this.totalActuators = totalActuators;
        this.actuatorsOn = actuatorsOn;
        this.totalAutomationRules = totalAutomationRules;
        this.activeAutomationRules = activeAutomationRules;
        this.openAlerts = openAlerts;
        this.latestReadings = latestReadings;
        this.latestAlerts = latestAlerts;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public long getTotalGreenhouses() {
        return totalGreenhouses;
    }

    public long getTotalZones() {
        return totalZones;
    }

    public long getTotalCrops() {
        return totalCrops;
    }

    public long getTotalSensors() {
        return totalSensors;
    }

    public long getActiveSensors() {
        return activeSensors;
    }

    public long getTotalActuators() {
        return totalActuators;
    }

    public long getActuatorsOn() {
        return actuatorsOn;
    }

    public long getTotalAutomationRules() {
        return totalAutomationRules;
    }

    public long getActiveAutomationRules() {
        return activeAutomationRules;
    }

    public long getOpenAlerts() {
        return openAlerts;
    }

    public List<DashboardLatestReadingResponse> getLatestReadings() {
        return latestReadings;
    }

    public List<DashboardAlertResponse> getLatestAlerts() {
        return latestAlerts;
    }
}