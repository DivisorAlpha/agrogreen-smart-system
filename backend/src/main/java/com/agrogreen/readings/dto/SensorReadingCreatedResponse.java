package com.agrogreen.readings.dto;

import com.agrogreen.automation.dto.AutomationEvaluationResponse;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: DTO used to return a created sensor reading together with automation evaluation result.
 */
public class SensorReadingCreatedResponse {

    private SensorReadingResponse reading;
    private AutomationEvaluationResponse automationEvaluation;

    public SensorReadingCreatedResponse() {
    }

    public SensorReadingCreatedResponse(
            SensorReadingResponse reading,
            AutomationEvaluationResponse automationEvaluation
    ) {
        this.reading = reading;
        this.automationEvaluation = automationEvaluation;
    }

    public SensorReadingResponse getReading() {
        return reading;
    }

    public AutomationEvaluationResponse getAutomationEvaluation() {
        return automationEvaluation;
    }
}