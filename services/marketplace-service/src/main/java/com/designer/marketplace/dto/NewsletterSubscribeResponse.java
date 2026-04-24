package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NewsletterSubscribeResponse {
    private boolean success;
    private String message;
    private String email;
    private LocalDateTime subscribedAt;
}
