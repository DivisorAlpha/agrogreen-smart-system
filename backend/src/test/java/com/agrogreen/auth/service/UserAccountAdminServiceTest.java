package com.agrogreen.auth.service;

import com.agrogreen.auth.dto.UpdateUserRoleRequest;
import com.agrogreen.auth.dto.UpdateUserStatusRequest;
import com.agrogreen.auth.dto.UserAccountResponse;
import com.agrogreen.auth.entity.UserAccount;
import com.agrogreen.auth.repository.UserAccountRepository;
import com.agrogreen.shared.exception.BusinessException;
import com.agrogreen.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Unit tests for user account administration service.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserAccountAdminServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private UserAccountAdminService userAccountAdminService;

    @Test
    void getAllUsersShouldReturnUserList() {
        UserAccount admin = mockUser(
                1L,
                "Administrador AgroGreen",
                "admin@agrogreen.com",
                "ADMIN",
                "ACTIVE"
        );

        UserAccount operator = mockUser(
                2L,
                "Operador AgroGreen",
                "operator@agrogreen.com",
                "OPERATOR",
                "ACTIVE"
        );

        when(userAccountRepository.findAll()).thenReturn(List.of(admin, operator));

        List<UserAccountResponse> result = userAccountAdminService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals("Administrador AgroGreen", result.get(0).getFullName());
        assertEquals("ADMIN", result.get(0).getRole());
        assertEquals("OPERATOR", result.get(1).getRole());

        verify(userAccountRepository, times(1)).findAll();
    }

    @Test
    void getUserByIdShouldReturnUserWhenExists() {
        UserAccount user = mockUser(
                1L,
                "Administrador AgroGreen",
                "admin@agrogreen.com",
                "ADMIN",
                "ACTIVE"
        );

        when(userAccountRepository.findById(1L)).thenReturn(Optional.of(user));

        UserAccountResponse result = userAccountAdminService.getUserById(1L);

        assertEquals(1L, result.getId());
        assertEquals("admin@agrogreen.com", result.getEmail());
        assertEquals("ADMIN", result.getRole());
        assertEquals("ACTIVE", result.getStatus());

        verify(userAccountRepository, times(1)).findById(1L);
    }

    @Test
    void getUserByIdShouldThrowExceptionWhenUserDoesNotExist() {
        when(userAccountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> userAccountAdminService.getUserById(99L)
        );

        verify(userAccountRepository, times(1)).findById(99L);
    }

    @Test
    void updateUserRoleShouldUpdateRoleWhenRoleIsValid() throws Exception {
        UserAccount user = mockUser(
                2L,
                "Operador AgroGreen",
                "operator@agrogreen.com",
                "OPERATOR",
                "ACTIVE"
        );

        UpdateUserRoleRequest request = new UpdateUserRoleRequest();
        setPrivateField(request, "role", "ADMIN");

        when(userAccountRepository.findById(2L)).thenReturn(Optional.of(user));
        when(userAccountRepository.save(user)).thenReturn(user);

        UserAccountResponse result = userAccountAdminService.updateUserRole(2L, request);

        assertEquals("ADMIN", result.getRole());

        verify(userAccountRepository, times(1)).findById(2L);
        verify(userAccountRepository, times(1)).save(user);
    }

    @Test
    void updateUserRoleShouldThrowExceptionWhenRoleIsInvalid() throws Exception {
        UserAccount user = mockUser(
                2L,
                "Operador AgroGreen",
                "operator@agrogreen.com",
                "OPERATOR",
                "ACTIVE"
        );

        UpdateUserRoleRequest request = new UpdateUserRoleRequest();
        setPrivateField(request, "role", "SUPER_USER");

        when(userAccountRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThrows(
                BusinessException.class,
                () -> userAccountAdminService.updateUserRole(2L, request)
        );

        verify(userAccountRepository, times(1)).findById(2L);
        verify(userAccountRepository, never()).save(user);
    }

    @Test
    void updateUserStatusShouldUpdateStatusWhenStatusIsValid() throws Exception {
        UserAccount user = mockUser(
                2L,
                "Operador AgroGreen",
                "operator@agrogreen.com",
                "OPERATOR",
                "ACTIVE"
        );

        UpdateUserStatusRequest request = new UpdateUserStatusRequest();
        setPrivateField(request, "status", "INACTIVE");

        when(userAccountRepository.findById(2L)).thenReturn(Optional.of(user));
        when(userAccountRepository.save(user)).thenReturn(user);

        UserAccountResponse result = userAccountAdminService.updateUserStatus(2L, request);

        assertEquals("INACTIVE", result.getStatus());

        verify(userAccountRepository, times(1)).findById(2L);
        verify(userAccountRepository, times(1)).save(user);
    }

    @Test
    void updateUserStatusShouldThrowExceptionWhenStatusIsInvalid() throws Exception {
        UserAccount user = mockUser(
                2L,
                "Operador AgroGreen",
                "operator@agrogreen.com",
                "OPERATOR",
                "ACTIVE"
        );

        UpdateUserStatusRequest request = new UpdateUserStatusRequest();
        setPrivateField(request, "status", "BLOCKED");

        when(userAccountRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThrows(
                BusinessException.class,
                () -> userAccountAdminService.updateUserStatus(2L, request)
        );

        verify(userAccountRepository, times(1)).findById(2L);
        verify(userAccountRepository, never()).save(user);
    }

    private UserAccount mockUser(
            Long id,
            String fullName,
            String email,
            String role,
            String status
    ) {
        UserAccount user = mock(UserAccount.class);

        when(user.getId()).thenReturn(id);
        when(user.getFullName()).thenReturn(fullName);
        when(user.getEmail()).thenReturn(email);
        when(user.getRole()).thenAnswer(invocation -> role);
        when(user.getStatus()).thenAnswer(invocation -> status);

        doAnswer(invocation -> {
            String newRole = invocation.getArgument(0);
            when(user.getRole()).thenReturn(newRole);
            return null;
        }).when(user).setRole(anyString());

        doAnswer(invocation -> {
            String newStatus = invocation.getArgument(0);
            when(user.getStatus()).thenReturn(newStatus);
            return null;
        }).when(user).setStatus(anyString());

        return user;
    }

    private void setPrivateField(
            Object target,
            String fieldName,
            Object value
    ) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}