package com.designer.marketplace.config;

import java.net.InetSocketAddress;
import java.time.Duration;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configures RestTemplate with proxy support for SEB corporate network
 * and appropriate timeouts for OAuth operations.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate bean with proxy and timeout configuration for OAuth calls.
     * - Proxy: Uses http_proxy env var if set (e.g., wss.sebank.se:80)
     * - Connection timeout: 5 seconds
     * - Read timeout: 10 seconds
     * - Socket timeout: 10 seconds
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // Set timeouts
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(10));
        
        // Configure proxy from environment
        String proxyHost = System.getenv("http_proxy");
        if (proxyHost != null && !proxyHost.isEmpty()) {
            // Parse URL like "http://wss.sebank.se:80" to hostname and port
            try {
                java.net.URL proxyUrl = new java.net.URL(proxyHost);
                factory.setProxy(new java.net.Proxy(
                    java.net.Proxy.Type.HTTP,
                    new InetSocketAddress(proxyUrl.getHost(), proxyUrl.getPort() == -1 ? 80 : proxyUrl.getPort())
                ));
            } catch (Exception e) {
                // If parsing fails, skip proxy configuration
                System.err.println("Failed to configure proxy from http_proxy: " + e.getMessage());
            }
        }
        
        return builder.requestFactory(() -> factory)
                      .setConnectTimeout(Duration.ofSeconds(5))
                      .setReadTimeout(Duration.ofSeconds(10))
                      .build();
    }
}
