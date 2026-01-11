package com.designer.marketplace.service;

import java.util.List;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import com.designer.marketplace.entity.Contract;
import com.designer.marketplace.repository.ContractRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Contract operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ContractService {

    private final ContractRepository contractRepository;

    public List<Contract> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();
        // Use Hibernate.initialize to eagerly load all associations
        contracts.forEach(c -> {
            Hibernate.initialize(c.getProject());
            Hibernate.initialize(c.getCompany());
            Hibernate.initialize(c.getFreelancer());
            Hibernate.initialize(c.getProposal());
            if (c.getProject() != null) {
                Hibernate.initialize(c.getProject().getProjectCategory());
            }
        });
        return contracts;
    }

    public Contract getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found: " + id));
        // Use Hibernate.initialize to eagerly load all associations
        Hibernate.initialize(contract.getProject());
        Hibernate.initialize(contract.getCompany());
        Hibernate.initialize(contract.getFreelancer());
        Hibernate.initialize(contract.getProposal());
        if (contract.getProject() != null) {
            Hibernate.initialize(contract.getProject().getProjectCategory());
        }
        return contract;
    }

    public List<Contract> getContractsByUserId(Long userId) {
        List<Contract> contracts = contractRepository.findByUserId(userId);
        // Use Hibernate.initialize to eagerly load all associations
        contracts.forEach(c -> {
            Hibernate.initialize(c.getProject());
            Hibernate.initialize(c.getCompany());
            Hibernate.initialize(c.getFreelancer());
            Hibernate.initialize(c.getProposal());
            if (c.getProject() != null) {
                Hibernate.initialize(c.getProject().getProjectCategory());
            }
        });
        return contracts;
    }

    public Contract createContract(Contract contract) {
        log.info("Creating new contract");
        return contractRepository.save(contract);
    }

    public Contract updateContract(Long id, Contract updates) {
        Contract existing = getContractById(id);
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getStartDate() != null) existing.setStartDate(updates.getStartDate());
        if (updates.getEndDate() != null) existing.setEndDate(updates.getEndDate());
        return contractRepository.save(existing);
    }

    public void deleteContract(Long id) {
        contractRepository.deleteById(id);
    }
}
