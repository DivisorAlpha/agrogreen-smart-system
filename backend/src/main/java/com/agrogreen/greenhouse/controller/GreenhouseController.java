package com.agrogreen.greenhouse.controller;

import com.agrogreen.greenhouse.dto.GreenhouseRequest;
import com.agrogreen.greenhouse.dto.GreenhouseResponse;
import com.agrogreen.greenhouse.service.GreenhouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Greenhouse
 * Description: REST controller for greenhouse operations.
 */
@RestController
@RequestMapping("/api/greenhouses")
public class GreenhouseController {

    private final GreenhouseService greenhouseService;

    public GreenhouseController(GreenhouseService greenhouseService) {
        this.greenhouseService = greenhouseService;
    }

    @GetMapping
    public List<GreenhouseResponse> findAll() {
        return greenhouseService.findAll();
    }

    @GetMapping("/{id}")
    public GreenhouseResponse findById(@PathVariable Long id) {
        return greenhouseService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GreenhouseResponse create(@Valid @RequestBody GreenhouseRequest request) {
        return greenhouseService.create(request);
    }

    @PutMapping("/{id}")
    public GreenhouseResponse update(
            @PathVariable Long id,
            @Valid @RequestBody GreenhouseRequest request
    ) {
        return greenhouseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        greenhouseService.delete(id);
    }
}