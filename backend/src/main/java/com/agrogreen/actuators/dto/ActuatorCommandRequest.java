package com.agrogreen.actuators.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Project: AgroGreen Smart System
 * Module: Actuators
 * Description: DTO used to send commands to actuators.
 */
public class ActuatorCommandRequest {

    @NotBlank(message = "El comando es obligatorio")
    @Size(max = 30, message = "El comando no puede superar los 30 caracteres")
    private String command;

    public ActuatorCommandRequest() {
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }
}