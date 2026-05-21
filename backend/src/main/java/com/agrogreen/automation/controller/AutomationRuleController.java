package com.agrogreen.automation.controller;

import com.agrogreen.automation.dto.AutomationEvaluationResponse;
import com.agrogreen.automation.dto.AutomationRuleRequest;
import com.agrogreen.automation.dto.AutomationRuleResponse;
import com.agrogreen.automation.service.AutomationRuleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Automation
 * Description: REST controller for automation rule operations.
 */
@RestController
@RequestMapping("/api/automation-rules")
public class AutomationRuleController {

    private final AutomationRuleService automationRuleService;

    public AutomationRuleController(AutomationRuleService automationRuleService) {
        this.automationRuleService = automationRuleService;
    }

    @GetMapping
    public List<AutomationRuleResponse> findAll() {
        return automationRuleService.findAll();
    }

    @GetMapping("/{id}")
    public AutomationRuleResponse findById(@PathVariable Long id) {
        return automationRuleService.findById(id);
    }

    @GetMapping("/sensor/{sensorCode}")
    public List<AutomationRuleResponse> findBySensorCode(@PathVariable String sensorCode) {
        return automationRuleService.findBySensorCode(sensorCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AutomationRuleResponse create(@Valid @RequestBody AutomationRuleRequest request) {
        return automationRuleService.create(request);
    }

    @PutMapping("/{id}")
    public AutomationRuleResponse update(
            @PathVariable Long id,
            @Valid @RequestBody AutomationRuleRequest request
    ) {
        return automationRuleService.update(id, request);
    }

    @PostMapping("/evaluate/{sensorCode}")
    public AutomationEvaluationResponse evaluateBySensorCode(@PathVariable String sensorCode) {
        return automationRuleService.evaluateBySensorCode(sensorCode);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        automationRuleService.delete(id);
    }
}