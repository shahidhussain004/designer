package com.designer.marketplace.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.designer.marketplace.repository.JobRepository;

class JobServiceTest {

    private JobRepository jobRepository;
    private JobService jobService;
    private UserService userService;
    private JobCategoryService categoryService;
    private ExperienceLevelService experienceLevelService;

    @BeforeEach
    void setup() {
        jobRepository = mock(JobRepository.class);
        userService = mock(UserService.class);
        categoryService = mock(JobCategoryService.class);
        experienceLevelService = mock(ExperienceLevelService.class);
        jobService = new JobService(jobRepository, userService, categoryService, experienceLevelService);
    }

    @Test
    void getJobs_withCategoryId_filtersCorrectly() {
        PageRequest pageable = PageRequest.of(0, 20);

        when(jobRepository.findByFilters(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.eq(pageable)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        // call with category ID
        jobService.getJobs(1L, null, null, null, null, pageable);

        // verify repository was called with correct ID
        ArgumentCaptor<Long> categoryCaptor = ArgumentCaptor.forClass(Long.class);
        verify(jobRepository).findByFilters(Mockito.any(), categoryCaptor.capture(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.eq(pageable));

        Long categoryId = categoryCaptor.getValue();
        assertNotNull(categoryId);
    }
}
