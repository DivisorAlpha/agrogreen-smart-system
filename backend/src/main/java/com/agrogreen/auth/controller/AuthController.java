package com.agrogreen.auth.controller;

import com.agrogreen.auth.dto.AuthResponse;
import com.agrogreen.auth.dto.LoginRequest;
import com.agrogreen.auth.dto.RegisterRequest;
import com.agrogreen.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.agrogreen.auth.dto.AuthUserProfileResponse;
import com.agrogreen.auth.dto.GoogleLoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.security.core.Authentication;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Controller that exposes authentication endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthUserProfileResponse getCurrentUser(Authentication authentication) {
        return authService.getCurrentUserProfile(authentication.getName());
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleLoginRequest request
    ) {
        return ResponseEntity.ok(authService.googleLogin(request.getCredential()));
    }
}