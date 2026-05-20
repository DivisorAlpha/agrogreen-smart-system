package com.agrogreen.zones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Zones
 * Description: DTO used to receive zone data from the client.
 */
public class ZoneRequest {

    @NotNull(message = "El id del invernadero es obligatorio")
    private Long greenhouseId;

    @NotBlank(message = "El nombre de la zona es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar los 120 caracteres")
    private String name;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String description;

    public ZoneRequest() {
    }

    public ZoneRequest(Long greenhouseId, String name, String description) {
        this.greenhouseId = greenhouseId;
        this.name = name;
        this.description = description;
    }

    public Long getGreenhouseId() {
        return greenhouseId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setGreenhouseId(Long greenhouseId) {
        this.greenhouseId = greenhouseId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}