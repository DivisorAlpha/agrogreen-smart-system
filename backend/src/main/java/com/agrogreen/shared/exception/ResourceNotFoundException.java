package com.agrogreen.shared.exception;

/**
 * Project: AgroGreen Smart System
 * Module: Shared Exceptions
 * Description: Exception thrown when a requested resource does not exist.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}