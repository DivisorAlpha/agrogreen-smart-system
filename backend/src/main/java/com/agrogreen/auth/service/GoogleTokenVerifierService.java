package com.agrogreen.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

/**
 * Project: AgroGreen Smart System
 * Module: Authentication
 * Description: Service used to validate Google ID tokens and extract
 * the authenticated Google account information.
 */
@Service
public class GoogleTokenVerifierService {

    private static final String GOOGLE_TOKEN_INFO_URL =
            "https://oauth2.googleapis.com/tokeninfo?id_token=";

    private final String googleClientId;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GoogleTokenVerifierService(
            @Value("${app.google.client-id}") String googleClientId
    ) {
        this.googleClientId = googleClientId;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public GoogleUserInfo verify(String credential) {
        if (credential == null || credential.isBlank()) {
            throw new IllegalArgumentException("Google credential is required.");
        }

        try {
            String encodedCredential = URLEncoder.encode(
                    credential,
                    StandardCharsets.UTF_8
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GOOGLE_TOKEN_INFO_URL + encodedCredential))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() != 200) {
                throw new IllegalArgumentException("Google token is invalid.");
            }

            JsonNode json = objectMapper.readTree(response.body());

            String audience = getTextValue(json, "aud");
            String email = getTextValue(json, "email");
            String emailVerified = getTextValue(json, "email_verified");
            String fullName = getTextValue(json, "name");

            if (!googleClientId.equals(audience)) {
                throw new IllegalArgumentException("Google token audience is invalid.");
            }

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Google account email is required.");
            }

            if (!"true".equalsIgnoreCase(emailVerified)) {
                throw new IllegalArgumentException("Google email is not verified.");
            }

            return new GoogleUserInfo(email, fullName);

        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Google token response could not be processed.",
                    exception
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalArgumentException(
                    "Google token verification was interrupted.",
                    exception
            );
        }
    }

    private String getTextValue(JsonNode json, String fieldName) {
        JsonNode value = json.get(fieldName);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }

    public static class GoogleUserInfo {

        private final String email;
        private final String fullName;

        public GoogleUserInfo(String email, String fullName) {
            this.email = email;
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }
    }
}