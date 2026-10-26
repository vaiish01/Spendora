
package com.Spendora.spendora_backend.budget;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    boolean existsByCategoryIgnoreCase(String category);

}
