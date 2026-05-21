package com.agrogreen.readings.controller;

import com.agrogreen.readings.dto.SensorReadingRequest;
import com.agrogreen.readings.dto.SensorReadingResponse;
import com.agrogreen.readings.service.SensorReadingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.agrogreen.readings.dto.SensorReadingCreatedResponse;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Sensor Readings
 * Description: REST controller for sensor reading operations.
 */
@RestController
@RequestMapping("/api/sensor-readings")
public class SensorReadingController {

    private final SensorReadingService sensorReadingService;

    public SensorReadingController(SensorReadingService sensorReadingService) {
        this.sensorReadingService = sensorReadingService;
    }

    @GetMapping
    public List<SensorReadingResponse> findAll() {
        return sensorReadingService.findAll();
    }

    @GetMapping("/{id}")
    public SensorReadingResponse findById(@PathVariable Long id) {
        return sensorReadingService.findById(id);
    }

    @GetMapping("/sensor/{sensorId}")
    public List<SensorReadingResponse> findBySensorId(@PathVariable Long sensorId) {
        return sensorReadingService.findBySensorId(sensorId);
    }

    @GetMapping("/sensor-code/{sensorCode}")
    public List<SensorReadingResponse> findBySensorCode(@PathVariable String sensorCode) {
        return sensorReadingService.findBySensorCode(sensorCode);
    }

    @GetMapping("/sensor-code/{sensorCode}/latest")
    public SensorReadingResponse findLatestBySensorCode(@PathVariable String sensorCode) {
        return sensorReadingService.findLatestBySensorCode(sensorCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SensorReadingCreatedResponse create(@Valid @RequestBody SensorReadingRequest request) {
        return sensorReadingService.create(request);
    }

    @PutMapping("/{id}")
    public SensorReadingResponse update(
            @PathVariable Long id,
            @Valid @RequestBody SensorReadingRequest request
    ) {
        return sensorReadingService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        sensorReadingService.delete(id);
    }
}
