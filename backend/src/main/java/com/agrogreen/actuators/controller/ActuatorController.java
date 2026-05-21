package com.agrogreen.actuators.controller;

import com.agrogreen.actuators.dto.ActuatorCommandRequest;
import com.agrogreen.actuators.dto.ActuatorRequest;
import com.agrogreen.actuators.dto.ActuatorResponse;
import com.agrogreen.actuators.service.ActuatorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: REST controller for actuator operations.
 */
@RestController
@RequestMapping("/api/actuators")
public class ActuatorController {

    private final ActuatorService actuatorService;

    public ActuatorController(ActuatorService actuatorService) {
        this.actuatorService = actuatorService;
    }

    @GetMapping
    public List<ActuatorResponse> findAll() {
        return actuatorService.findAll();
    }

    @GetMapping("/{id}")
    public ActuatorResponse findById(@PathVariable Long id) {
        return actuatorService.findById(id);
    }

    @GetMapping("/code/{code}")
    public ActuatorResponse findByCode(@PathVariable String code) {
        return actuatorService.findByCode(code);
    }

    @GetMapping("/zone/{zoneId}")
    public List<ActuatorResponse> findByZoneId(@PathVariable Long zoneId) {
        return actuatorService.findByZoneId(zoneId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActuatorResponse create(@Valid @RequestBody ActuatorRequest request) {
        return actuatorService.create(request);
    }

    @PutMapping("/{id}")
    public ActuatorResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ActuatorRequest request
    ) {
        return actuatorService.update(id, request);
    }

    @PatchMapping("/code/{code}/command")
    public ActuatorResponse executeCommand(
            @PathVariable String code,
            @Valid @RequestBody ActuatorCommandRequest request
    ) {
        return actuatorService.executeCommand(code, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        actuatorService.delete(id);
    }
}