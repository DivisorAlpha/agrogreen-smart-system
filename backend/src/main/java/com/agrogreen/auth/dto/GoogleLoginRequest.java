package com.agrogreen.auth.dto;

public class GoogleLoginRequest {

    private String credential;

    public GoogleLoginRequest() {
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}