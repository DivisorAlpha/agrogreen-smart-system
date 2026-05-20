package com.agrogreen.status.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Project: AgroGreen Smart System
 * Module: Status
 * Description: Controller used to verify that the backend is running correctly.
 */
@RestController
public class StatusController {

    @GetMapping("/api/status")
    public Map<String, String> status() {
        return Map.of(
                "message", "AgroGreen backend is running",
                "status", "UP"
        );
    }
}
