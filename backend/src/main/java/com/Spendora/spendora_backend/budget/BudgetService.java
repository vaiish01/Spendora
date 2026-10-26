
package com.Spendora.spendora_backend.budget;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository repository;

    public BudgetService(BudgetRepository repository) {
        this.repository = repository;
    }

    public List<Budget> getAllBudgets() {
        return repository.findAll();
    }

    public Budget getBudgetById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Budget not found"));
    }

    public Budget createBudget(Budget budget) {
        budget.setId(null);

        if (repository.existsByCategoryIgnoreCase(budget.getCategory())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A budget already exists for this category");
        }

        return repository.save(budget);
    }

    public Budget updateBudget(Long id, Budget updatedBudget) {
        Budget existing = getBudgetById(id);

        boolean categoryUsedByAnotherBudget =
                repository.existsByCategoryIgnoreCase(updatedBudget.getCategory())
                && !existing.getCategory().equalsIgnoreCase(
                        updatedBudget.getCategory());

        if (categoryUsedByAnotherBudget) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A budget already exists for this category");
        }

        existing.setCategory(updatedBudget.getCategory());
        existing.setLimit(updatedBudget.getLimit());

        return repository.save(existing);
    }

    public void deleteBudget(Long id) {
        Budget existing = getBudgetById(id);
        repository.delete(existing);
    }
}
