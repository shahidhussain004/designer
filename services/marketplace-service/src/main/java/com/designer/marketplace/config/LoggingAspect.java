package com.designer.marketplace.config;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Aspect for logging method execution, performance metrics, and debugging
 * Logs all controller, service, and repository method calls with execution time
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Log all controller methods with request details, parameters, and performance
     */
    @Around("execution(* com.designer.marketplace.controller..*(..))")
    public Object logController(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        // Get HTTP request details
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String requestInfo = "";
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            requestInfo = String.format(" [%s %s]", request.getMethod(), request.getRequestURI());
        }

        // Log method arguments (be careful with sensitive data)
        Object[] args = joinPoint.getArgs();
        String argsString = args.length > 0 ? Arrays.stream(args)
                .map(arg -> arg != null ? arg.getClass().getSimpleName() : "null")
                .collect(Collectors.joining(", ")) : "no args";

        log.info(">>> {} {}.{}({}){}",
                "CONTROLLER",
                className,
                methodName,
                argsString,
                requestInfo);

        Object result;
        try {
            result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            log.info("<<< {} {}.{} completed in {}ms - SUCCESS",
                    "CONTROLLER",
                    className,
                    methodName,
                    executionTime);

            // Warn if slow
            if (executionTime > 1000) {
                log.warn("SLOW CONTROLLER: {}.{} took {}ms", className, methodName, executionTime);
            }

            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("<<< {} {}.{} failed after {}ms - ERROR: {}",
                    "CONTROLLER",
                    className,
                    methodName,
                    executionTime,
                    e.getMessage());
            throw e;
        }
    }

    /**
     * Log all service methods with performance tracking
     */
    @Around("execution(* com.designer.marketplace.service..*(..))")
    public Object logService(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        log.debug(">>> SERVICE: {}.{}()", className, methodName);

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            log.debug("<<< SERVICE: {}.{} completed in {}ms", className, methodName, executionTime);

            // Warn if slow
            if (executionTime > 500) {
                log.warn("SLOW SERVICE: {}.{} took {}ms", className, methodName, executionTime);
            }

            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("<<< SERVICE: {}.{} failed after {}ms - ERROR: {}",
                    className, methodName, executionTime, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Log all repository/database operations
     */
    @Around("execution(* com.designer.marketplace.repository..*(..))")
    public Object logRepository(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        log.debug(">>> DB: {}.{}()", className, methodName);

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            log.debug("<<< DB: {}.{} completed in {}ms", className, methodName, executionTime);

            // Warn if slow query
            if (executionTime > 200) {
                log.warn("SLOW QUERY: {}.{} took {}ms", className, methodName, executionTime);
            }

            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("<<< DB: {}.{} failed after {}ms - ERROR: {}",
                    className, methodName, executionTime, e.getMessage());
            throw e;
        }
    }
}
