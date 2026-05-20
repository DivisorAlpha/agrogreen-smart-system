package com.agrogreen.zones.controller;

import com.agrogreen.zones.dto.ZoneRequest;
import com.agrogreen.zones.dto.ZoneResponse;
import com.agrogreen.zones.service.ZoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Zones
 * Description: REST controller for zone operations.
 */
@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public List<ZoneResponse> findAll() {
        return zoneService.findAll();
    }

    @GetMapping("/{id}")
    public ZoneResponse findById(@PathVariable Long id) {
        return zoneService.findById(id);
    }

    @GetMapping("/greenhouse/{greenhouseId}")
    public List<ZoneResponse> findByGreenhouseId(@PathVariable Long greenhouseId) {
        return zoneService.findByGreenhouseId(greenhouseId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ZoneResponse create(@Valid @RequestBody ZoneRequest request) {
        return zoneService.create(request);
    }

    @PutMapping("/{id}")
    public ZoneResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ZoneRequest request
    ) {
        return zoneService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        zoneService.delete(id);
    }
}