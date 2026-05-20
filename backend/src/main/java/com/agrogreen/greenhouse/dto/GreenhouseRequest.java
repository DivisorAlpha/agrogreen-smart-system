package com.agrogreen.greenhouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Greenhouse
 * Description: DTO used to receive greenhouse data from the client.
 */
public class GreenhouseRequest {

    @NotBlank(message = "El nombre del invernadero es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar los 120 caracteres")
    private String name;

    @NotBlank(message = "La ubicación del invernadero es obligatoria")
    @Size(max = 180, message = "La ubicación no puede superar los 180 caracteres")
    private String location;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String description;

    public GreenhouseRequest() {
    }

    public GreenhouseRequest(String name, String location, String description) {
        this.name = name;
        this.location = location;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}