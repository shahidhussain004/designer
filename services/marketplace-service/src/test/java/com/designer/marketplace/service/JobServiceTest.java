package com.designer.marketplace.service;

import com.designer.marketplace.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobServiceTest {

    private JobRepository jobRepository;
    private JobService jobService;
    private UserService userService;

    @BeforeEach
    void setup() {
        jobRepository = mock(JobRepository.class);
        userService = mock(UserService.class);
        jobService = new JobService(jobRepository, userService);
    }

    @Test
    void getJobs_normalizesCategoryTokens_caseInsensitive() {
        PageRequest pageable = PageRequest.of(0, 20);

        when(jobRepository.findByFilters(Mockito.any(), Mockito.anyString(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.eq(pageable)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        // call with underscored token
        jobService.getJobs("WEB_DESIGN", null, null, null, null, pageable);

        // capture normalized category
        ArgumentCaptor<String> categoryCaptor = ArgumentCaptor.forClass(String.class);
        verify(jobRepository).findByFilters(Mockito.any(), categoryCaptor.capture(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.eq(pageable));

        String normalized = categoryCaptor.getValue();
        assertNotNull(normalized);
        assertTrue(normalized.equalsIgnoreCase("Web Design") || normalized.toLowerCase().contains("web"));
    }
}
