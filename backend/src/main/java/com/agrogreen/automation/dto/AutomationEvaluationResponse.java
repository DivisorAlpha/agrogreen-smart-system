package com.agrogreen.automation.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: DTO used to return the result of evaluating automation rules.
 */
public class AutomationEvaluationResponse {

    private String sensorCode;
    private Double readingValue;
    private LocalDateTime readingDateTime;
    private int rulesEvaluated;
    private int rulesTriggered;
    private List<String> actions;

    public AutomationEvaluationResponse() {
    }

    public AutomationEvaluationResponse(
            String sensorCode,
            Double readingValue,
            LocalDateTime readingDateTime,
            int rulesEvaluated,
            int rulesTriggered,
            List<String> actions
    ) {
        this.sensorCode = sensorCode;
        this.readingValue = readingValue;
        this.readingDateTime = readingDateTime;
        this.rulesEvaluated = rulesEvaluated;
        this.rulesTriggered = rulesTriggered;
        this.actions = actions;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public Double getReadingValue() {
        return readingValue;
    }

    public LocalDateTime getReadingDateTime() {
        return readingDateTime;
    }

    public int getRulesEvaluated() {
        return rulesEvaluated;
    }

    public int getRulesTriggered() {
        return rulesTriggered;
    }

    public List<String> getActions() {
        return actions;
    }
}