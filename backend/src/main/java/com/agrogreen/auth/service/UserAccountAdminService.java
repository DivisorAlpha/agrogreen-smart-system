package com.agrogreen.auth.service;

import com.agrogreen.auth.dto.UpdateUserRoleRequest;
import com.agrogreen.auth.dto.UpdateUserStatusRequest;
import com.agrogreen.auth.dto.UserAccountResponse;
import com.agrogreen.auth.entity.UserAccount;
import com.agrogreen.auth.repository.UserAccountRepository;
import com.agrogreen.shared.exception.BusinessException;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Service used by administrators to manage user accounts.
 */
@Service
@Transactional(readOnly = true)
public class UserAccountAdminService {

    private final UserAccountRepository userAccountRepository;

    public UserAccountAdminService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public List<UserAccountResponse> getAllUsers() {
        return userAccountRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserAccountResponse getUserById(Long id) {
        UserAccount user = findUserById(id);

        return toResponse(user);
    }

    @Transactional
    public UserAccountResponse updateUserRole(
            Long id,
            UpdateUserRoleRequest request
    ) {
        UserAccount user = findUserById(id);

        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new BusinessException("Role is required");
        }

        String normalizedRole = request.getRole().trim().toUpperCase();

        if (!normalizedRole.equals("ADMIN") && !normalizedRole.equals("OPERATOR")) {
            throw new BusinessException("Invalid role. Allowed roles: ADMIN, OPERATOR");
        }

        user.setRole(normalizedRole);

        return toResponse(userAccountRepository.save(user));
    }

    @Transactional
    public UserAccountResponse updateUserStatus(
            Long id,
            UpdateUserStatusRequest request
    ) {
        UserAccount user = findUserById(id);

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            throw new BusinessException("Status is required");
        }

        String normalizedStatus = request.getStatus().trim().toUpperCase();

        if (!normalizedStatus.equals("ACTIVE") && !normalizedStatus.equals("INACTIVE")) {
            throw new BusinessException("Invalid status. Allowed statuses: ACTIVE, INACTIVE");
        }

        user.setStatus(normalizedStatus);

        return toResponse(userAccountRepository.save(user));
    }

    private UserAccount findUserById(Long id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User account not found with id: " + id
                ));
    }

    private UserAccountResponse toResponse(UserAccount user) {
        return new UserAccountResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}