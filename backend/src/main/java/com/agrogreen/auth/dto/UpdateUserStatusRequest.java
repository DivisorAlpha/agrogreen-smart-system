package com.agrogreen.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Request DTO used to update a user account status.
 */
public class UpdateUserStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public UpdateUserStatusRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}