package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.entity.Contract;
import com.designer.marketplace.service.ContractService;

import lombok.RequiredArgsConstructor;

/**
 * REST Controller for Contract operations
 * 
 * Endpoints:
 * - GET /api/contracts - Get all contracts
 * - GET /api/contracts/{id} - Get contract by ID
 * - POST /api/contracts - Create contract
 * - PUT /api/contracts/{id} - Update contract
 * - DELETE /api/contracts/{id} - Delete contract
 * - GET /api/users/{userId}/contracts - Get contracts for user (nested)
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping("/contracts")
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/contracts/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }

    @GetMapping("/users/{userId}/contracts")
    public ResponseEntity<List<Contract>> getContractsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(contractService.getContractsByUserId(userId));
    }

    @PostMapping("/contracts")
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        Contract created = contractService.createContract(contract);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/contracts/{id}")
    public ResponseEntity<Contract> updateContract(
            @PathVariable Long id,
            @RequestBody Contract updates) {
        Contract updated = contractService.updateContract(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }
}
