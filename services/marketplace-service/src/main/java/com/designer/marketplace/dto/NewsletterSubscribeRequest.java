package com.designer.marketplace.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewsletterSubscribeRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    /** Optional source tag (e.g. "footer", "popup"). Defaults to "footer". */
    private String source = "footer";
}
