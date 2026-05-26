package com.agrogreen.config;

import com.agrogreen.auth.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Project: AgroGreen Smart System
 * Module: Security
 * Description: Security configuration with JWT authentication and role-based authorization.
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                    {
                                      "status": 401,
                                      "error": "Unauthorized",
                                      "message": "Authentication is required to access this resource"
                                    }
                                    """);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                    {
                                      "status": 403,
                                      "error": "Forbidden",
                                      "message": "You do not have permission to perform this action"
                                    }
                                    """);
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // Preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

                        .requestMatchers(
                                "/api/status",
                                "/api/status/**",
                                "/actuator/health",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/auth/me")
                        .hasAnyRole("ADMIN", "OPERATOR")

                        // Dashboard, monitoring and charts data
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/**")
                        .hasAnyRole("ADMIN", "OPERATOR")

                        // Greenhouses
                        .requestMatchers(HttpMethod.GET, "/api/greenhouses/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/greenhouses/**")
                        .hasRole("ADMIN")

                        // Zones
                        .requestMatchers(HttpMethod.GET, "/api/zones/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/zones/**")
                        .hasRole("ADMIN")

                        // Crops
                        .requestMatchers(HttpMethod.GET, "/api/crops/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/crops/**")
                        .hasRole("ADMIN")

                        // Sensors
                        .requestMatchers(HttpMethod.GET, "/api/sensors/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/sensors/**")
                        .hasRole("ADMIN")

                        // Sensor readings
                        .requestMatchers(HttpMethod.GET, "/api/sensor-readings/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.POST, "/api/sensor-readings/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.PUT, "/api/sensor-readings/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sensor-readings/**")
                        .hasRole("ADMIN")

                        // Actuators
                        .requestMatchers(HttpMethod.GET, "/api/actuators/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/actuators/code/**/command")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/actuators/**")
                        .hasRole("ADMIN")

                        // Automation rules
                        .requestMatchers(HttpMethod.GET, "/api/automation-rules/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.POST, "/api/automation-rules/evaluate/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers("/api/automation-rules/**")
                        .hasRole("ADMIN")

                        // Alerts
                        .requestMatchers(HttpMethod.GET, "/api/alerts/**")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/alerts/**/resolve")
                        .hasAnyRole("ADMIN", "OPERATOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/alerts/**")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/alerts/**")
                        .hasRole("ADMIN")

                        // Any other endpoint requires ADMIN
                        .anyRequest()
                        .hasRole("ADMIN")
                )
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}