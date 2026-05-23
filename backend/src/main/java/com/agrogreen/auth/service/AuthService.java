package com.agrogreen.auth.service;

import com.agrogreen.auth.dto.AuthResponse;
import com.agrogreen.auth.dto.LoginRequest;
import com.agrogreen.auth.dto.RegisterRequest;
import com.agrogreen.auth.entity.UserAccount;
import com.agrogreen.auth.repository.UserAccountRepository;
import com.agrogreen.shared.exception.BusinessException;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Service for user registration and login.
 */
@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered");
        }

        UserAccount user = new UserAccount();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? "ADMIN" : request.getRole());
        user.setStatus("ACTIVE");

        UserAccount savedUser = userAccountRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return toResponse(savedUser, token);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException("User account is not active");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return toResponse(user, token);
    }

    private AuthResponse toResponse(UserAccount user, String token) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}