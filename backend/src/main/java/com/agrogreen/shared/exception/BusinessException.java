package com.agrogreen.shared.exception;

/**
 * Project: AgroGreen Smart System
 * Module: Shared Exceptions
 * Description: Exception thrown when a business rule is violated.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}