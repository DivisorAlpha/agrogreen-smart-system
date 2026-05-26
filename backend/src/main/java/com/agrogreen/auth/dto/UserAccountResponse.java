package com.agrogreen.auth.dto;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: DTO used to expose user account data to administrators.
 */
public class UserAccountResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String status;

    public UserAccountResponse() {
    }

    public UserAccountResponse(
            Long id,
            String fullName,
            String email,
            String role,
            String status
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }
}