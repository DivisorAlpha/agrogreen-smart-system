package com.agrogreen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
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

        return http
                // Desactiva CSRF para permitir pruebas con Postman en APIs REST
                .csrf(AbstractHttpConfigurer::disable)

                // Habilita configuración CORS básica
                .cors(Customizer.withDefaults())

                // API sin sesiones por ahora
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Permisos temporales para desarrollo
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/status",
                                "/api/status/**",
                                "/api/greenhouses/**",
                                "/api/zones/**",
                                "/api/crops/**",
                                "/api/sensors/**",
                                "/api/sensor-readings/**",
                                "/api/actuators/**",
                                "/actuator/health",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                )

                // Desactivar login por formulario y basic auth en esta fase
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .build();
    }
}