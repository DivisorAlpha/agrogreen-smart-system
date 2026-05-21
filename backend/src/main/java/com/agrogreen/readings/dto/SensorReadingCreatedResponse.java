package com.agrogreen.readings.dto;

import com.agrogreen.alerts.dto.AlertResponse;
import com.agrogreen.automation.dto.AutomationEvaluationResponse;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: DTO used to return a created sensor reading together with automation and alert results.
 */
public class SensorReadingCreatedResponse {

    private SensorReadingResponse reading;
    private AutomationEvaluationResponse automationEvaluation;
    private AlertResponse alert;

    public SensorReadingCreatedResponse() {
    }

    public SensorReadingCreatedResponse(
            SensorReadingResponse reading,
            AutomationEvaluationResponse automationEvaluation
    ) {
        this.reading = reading;
        this.automationEvaluation = automationEvaluation;
    }

    public SensorReadingCreatedResponse(
            SensorReadingResponse reading,
            AutomationEvaluationResponse automationEvaluation,
            AlertResponse alert
    ) {
        this.reading = reading;
        this.automationEvaluation = automationEvaluation;
        this.alert = alert;
    }

    public SensorReadingResponse getReading() {
        return reading;
    }

    public AutomationEvaluationResponse getAutomationEvaluation() {
        return automationEvaluation;
    }

    public AlertResponse getAlert() {
        return alert;
    }
}