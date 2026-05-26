package com.agrogreen.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Request DTO used to update a user role.
 */
public class UpdateUserRoleRequest {

    @NotBlank(message = "Role is required")
    private String role;

    public UpdateUserRoleRequest() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}