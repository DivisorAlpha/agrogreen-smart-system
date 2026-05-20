package com.agrogreen.crops.controller;

import com.agrogreen.crops.dto.CropRequest;
import com.agrogreen.crops.dto.CropResponse;
import com.agrogreen.crops.service.CropService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: REST controller for crop operations.
 */
@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping
    public List<CropResponse> findAll() {
        return cropService.findAll();
    }

    @GetMapping("/{id}")
    public CropResponse findById(@PathVariable Long id) {
        return cropService.findById(id);
    }

    @GetMapping("/zone/{zoneId}")
    public List<CropResponse> findByZoneId(@PathVariable Long zoneId) {
        return cropService.findByZoneId(zoneId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CropResponse create(@Valid @RequestBody CropRequest request) {
        return cropService.create(request);
    }

    @PutMapping("/{id}")
    public CropResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CropRequest request
    ) {
        return cropService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        cropService.delete(id);
    }
}