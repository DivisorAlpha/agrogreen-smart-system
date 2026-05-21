package com.agrogreen.sensors.controller;

import com.agrogreen.sensors.dto.SensorRequest;
import com.agrogreen.sensors.dto.SensorResponse;
import com.agrogreen.sensors.service.SensorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Sensors
 * Description: REST controller for sensor operations.
 */
@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping
    public List<SensorResponse> findAll() {
        return sensorService.findAll();
    }

    @GetMapping("/{id}")
    public SensorResponse findById(@PathVariable Long id) {
        return sensorService.findById(id);
    }

    @GetMapping("/code/{code}")
    public SensorResponse findByCode(@PathVariable String code) {
        return sensorService.findByCode(code);
    }

    @GetMapping("/zone/{zoneId}")
    public List<SensorResponse> findByZoneId(@PathVariable Long zoneId) {
        return sensorService.findByZoneId(zoneId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SensorResponse create(@Valid @RequestBody SensorRequest request) {
        return sensorService.create(request);
    }

    @PutMapping("/{id}")
    public SensorResponse update(
            @PathVariable Long id,
            @Valid @RequestBody SensorRequest request
    ) {
        return sensorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        sensorService.delete(id);
    }
}
