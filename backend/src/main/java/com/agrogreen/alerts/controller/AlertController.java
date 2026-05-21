package com.agrogreen.alerts.controller;

import com.agrogreen.alerts.dto.AlertRequest;
import com.agrogreen.alerts.dto.AlertResponse;
import com.agrogreen.alerts.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Alerts
 * Description: REST controller for alert operations.
 */
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<AlertResponse> findAll() {
        return alertService.findAll();
    }

    @GetMapping("/{id}")
    public AlertResponse findById(@PathVariable Long id) {
        return alertService.findById(id);
    }

    @GetMapping("/status/{status}")
    public List<AlertResponse> findByStatus(@PathVariable String status) {
        return alertService.findByStatus(status);
    }

    @GetMapping("/sensor/{sensorCode}")
    public List<AlertResponse> findBySensorCode(@PathVariable String sensorCode) {
        return alertService.findBySensorCode(sensorCode);
    }

    @GetMapping("/sensor/{sensorCode}/open")
    public List<AlertResponse> findOpenBySensorCode(@PathVariable String sensorCode) {
        return alertService.findOpenBySensorCode(sensorCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlertResponse create(@Valid @RequestBody AlertRequest request) {
        return alertService.create(request);
    }

    @PatchMapping("/{id}/resolve")
    public AlertResponse resolve(@PathVariable Long id) {
        return alertService.resolve(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        alertService.delete(id);
    }
}
