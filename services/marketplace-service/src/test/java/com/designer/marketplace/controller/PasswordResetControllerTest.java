package com.designer.marketplace.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.designer.marketplace.dto.request.ForgotPasswordRequest;
import com.designer.marketplace.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Integration tests for password reset endpoints
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PasswordResetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    private ForgotPasswordRequest forgotPasswordRequest;

    @BeforeEach
    public void setUp() {
        forgotPasswordRequest = new ForgotPasswordRequest();
        forgotPasswordRequest.setEmail("test@example.com");
    }

    @Test
    public void testForgotPasswordEmailNotFound() throws Exception {
        mockMvc.perform(post("/api/users/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(forgotPasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset instructions sent to your email"));
    }

    @Test
    public void testForgotPasswordInvalidEmail() throws Exception {
        ForgotPasswordRequest invalidRequest = new ForgotPasswordRequest();
        invalidRequest.setEmail("invalid-email");

        mockMvc.perform(post("/api/users/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testForgotPasswordEmptyEmail() throws Exception {
        ForgotPasswordRequest emptyRequest = new ForgotPasswordRequest();
        emptyRequest.setEmail("");

        mockMvc.perform(post("/api/users/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testResetPasswordInvalidToken() throws Exception {
        String resetPasswordJson = "{\"token\":\"invalid-token\",\"newPassword\":\"NewPassword123\"}";

        mockMvc.perform(post("/api/users/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(resetPasswordJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid Token"));
    }

    @Test
    public void testResetPasswordWeakPassword() throws Exception {
        String resetPasswordJson = "{\"token\":\"valid-token\",\"newPassword\":\"weak\"}";

        mockMvc.perform(post("/api/users/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(resetPasswordJson))
                .andExpect(status().isBadRequest());
    }
}
