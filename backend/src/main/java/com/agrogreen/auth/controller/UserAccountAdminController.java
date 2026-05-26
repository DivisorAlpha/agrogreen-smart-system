package com.agrogreen.auth.controller;

import com.agrogreen.auth.dto.UpdateUserRoleRequest;
import com.agrogreen.auth.dto.UpdateUserStatusRequest;
import com.agrogreen.auth.dto.UserAccountResponse;
import com.agrogreen.auth.service.UserAccountAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Controller used by administrators to manage user accounts.
 */
@RestController
@RequestMapping("/api/users")
public class UserAccountAdminController {

    private final UserAccountAdminService userAccountAdminService;

    public UserAccountAdminController(
            UserAccountAdminService userAccountAdminService
    ) {
        this.userAccountAdminService = userAccountAdminService;
    }

    @GetMapping
    public List<UserAccountResponse> getAllUsers() {
        return userAccountAdminService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserAccountResponse getUserById(@PathVariable Long id) {
        return userAccountAdminService.getUserById(id);
    }

    @PatchMapping("/{id}/role")
    public UserAccountResponse updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return userAccountAdminService.updateUserRole(id, request);
    }

    @PatchMapping("/{id}/status")
    public UserAccountResponse updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        return userAccountAdminService.updateUserStatus(id, request);
    }
}