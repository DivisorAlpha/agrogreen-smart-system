package com.agrogreen.auth.service;

import com.agrogreen.auth.dto.AuthResponse;
import com.agrogreen.auth.dto.LoginRequest;
import com.agrogreen.auth.dto.RegisterRequest;
import com.agrogreen.auth.dto.AuthUserProfileResponse;
import com.agrogreen.auth.entity.UserAccount;
import com.agrogreen.auth.repository.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.agrogreen.auth.service.GoogleTokenVerifierService.GoogleUserInfo;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Service for user registration, traditional login,
 * Google login, and authenticated user profile information.
 */
@Service
public class AuthService {

    private static final String DEFAULT_PUBLIC_ROLE = "OPERATOR";
    private static final String DEFAULT_ACTIVE_STATUS = "ACTIVE";
    private static final String INACTIVE_STATUS = "INACTIVE";
    private static final String GOOGLE_AUTH_PASSWORD_PLACEHOLDER = "GOOGLE_AUTH_USER";

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleTokenVerifierService googleTokenVerifierService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            GoogleTokenVerifierService googleTokenVerifierService
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleTokenVerifierService = googleTokenVerifierService;
    }

    /**
     * Registers a new user from the public registration form.
     * Public registration always creates OPERATOR users.
     * ADMIN users must only be assigned by an existing administrator.
     */
    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        String email = request.getEmail().trim().toLowerCase();
        String fullName = request.getFullName().trim();

        if (userAccountRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        UserAccount user = new UserAccount();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(DEFAULT_PUBLIC_ROLE);
        user.setStatus(DEFAULT_ACTIVE_STATUS);

        UserAccount savedUser = userAccountRepository.save(user);

        return buildAuthResponse("User registered successfully.", savedUser);
    }

    /**
     * Authenticates a user with email and password.
     */
    public AuthResponse login(LoginRequest request) {
        validateLoginRequest(request);

        String email = request.getEmail().trim().toLowerCase();

        UserAccount user = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        validateActiveUser(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return buildAuthResponse("Login successful.", user);
    }

    /**
     * Authenticates a user using Google Identity Services.
     * If the Google email does not exist in the system, a new OPERATOR user is created.
     * If the user already exists, the system preserves the current role.
     */
    public AuthResponse googleLogin(String credential) {
    if (credential == null || credential.isBlank()) {
        throw new IllegalArgumentException("Google credential is required.");
    }

    GoogleUserInfo googleUserInfo = googleTokenVerifierService.verify(credential);

    String normalizedEmail = googleUserInfo.getEmail().trim().toLowerCase();
    String googleFullName = googleUserInfo.getFullName();

    UserAccount user = userAccountRepository.findByEmail(normalizedEmail)
            .orElseGet(() -> createGoogleOperatorUser(normalizedEmail, googleFullName));

    validateActiveUser(user);

    return buildAuthResponse("Google login successful.", user);
}

    /**
     * Returns the authenticated user profile.
     * This method name is used by AuthController.
     */
    public AuthUserProfileResponse getCurrentUserProfile(String email) {
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("Authenticated user email is required.");
    }

    String normalizedEmail = email.trim().toLowerCase();

    UserAccount user = userAccountRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new IllegalArgumentException("Authenticated user was not found."));

    validateActiveUser(user);

    return new AuthUserProfileResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getStatus()
    );
    }

    /**
     * Creates a new user from a verified Google account.
     * New Google users are created as OPERATOR by default.
     */
    private UserAccount createGoogleOperatorUser(String email, String googleFullName) {
        UserAccount newUser = new UserAccount();

        newUser.setFullName(
                googleFullName != null && !googleFullName.isBlank()
                        ? googleFullName
                        : email
        );

        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(GOOGLE_AUTH_PASSWORD_PLACEHOLDER));
        newUser.setRole(DEFAULT_PUBLIC_ROLE);
        newUser.setStatus(DEFAULT_ACTIVE_STATUS);

        return userAccountRepository.save(newUser);
    }

    /**
     * Builds the authentication response returned to the frontend.
     * AuthResponse constructor requires:
     * message, token, userId, fullName, email, role.
     */
    private AuthResponse buildAuthResponse(String message, UserAccount user) {
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                message,
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    /**
     * Ensures that inactive users cannot access the system.
     */
    private void validateActiveUser(UserAccount user) {
        if (user.getStatus() != null && INACTIVE_STATUS.equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("The user account is inactive.");
        }
    }

    /**
     * Validates the registration request.
     */
    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration data is required.");
        }

        if (request.getFullName() == null || request.getFullName().trim().isBlank()) {
            throw new IllegalArgumentException("Full name is required.");
        }

        if (request.getEmail() == null || request.getEmail().trim().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must have at least 6 characters.");
        }
    }

    /**
     * Validates the login request.
     */
    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Login data is required.");
        }

        if (request.getEmail() == null || request.getEmail().trim().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }
    }
}