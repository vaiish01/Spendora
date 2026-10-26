
package com.Spendora.spendora_backend.dashboard;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.Spendora.spendora_backend.budget.Budget;
import com.Spendora.spendora_backend.budget.BudgetRepository;
import com.Spendora.spendora_backend.goal.Goal;
import com.Spendora.spendora_backend.goal.GoalRepository;
import com.Spendora.spendora_backend.transaction.Transaction;
import com.Spendora.spendora_backend.transaction.TransactionRepository;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    public DashboardService(
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository,
            GoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        List<Transaction> transactions = transactionRepository.findAll();
        List<Budget> budgets = budgetRepository.findAll();
        List<Goal> goals = goalRepository.findAll();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {
            BigDecimal amount = transaction.getAmount();
            String type = transaction.getType();

            if (amount == null || type == null) {
                continue;
            }

            if ("income".equalsIgnoreCase(type)) {
                totalIncome = totalIncome.add(amount);
            } else if ("expense".equalsIgnoreCase(type)) {
                totalExpenses = totalExpenses.add(amount);
            }
        }

        BigDecimal balance = totalIncome.subtract(totalExpenses);

        BigDecimal totalGoalTarget = BigDecimal.ZERO;
        BigDecimal totalGoalSaved = BigDecimal.ZERO;

        for (Goal goal : goals) {
            if (goal.getTargetAmount() != null) {
                totalGoalTarget = totalGoalTarget.add(goal.getTargetAmount());
            }

            if (goal.getSavedAmount() != null) {
                totalGoalSaved = totalGoalSaved.add(goal.getSavedAmount());
            }
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance);
        summary.put("transactionCount", transactions.size());
        summary.put("budgetCount", budgets.size());
        summary.put("goalCount", goals.size());
        summary.put("totalGoalTarget", totalGoalTarget);
        summary.put("totalGoalSaved", totalGoalSaved);
        summary.put("recentTransactions",
                transactions.stream()
                        .sorted((a, b) -> {
                            if (a.getDate() == null) return 1;
                            if (b.getDate() == null) return -1;
                            return b.getDate().compareTo(a.getDate());
                        })
                        .limit(5)
                        .toList());

        return summary;
    }
}
