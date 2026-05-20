package com.agrogreen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Project: AgroGreen Smart System
 * Module: Security
 * Description: Initial security configuration for development.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/status",
                                "/api/greenhouses/**",
                                "/actuator/health"
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}