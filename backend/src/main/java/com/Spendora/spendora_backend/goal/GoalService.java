
package com.Spendora.spendora_backend.goal;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoalService {

    private final GoalRepository repository;

    public GoalService(GoalRepository repository) {
        this.repository = repository;
    }

    public List<Goal> getAllGoals() {
        return repository.findAll();
    }

    public Goal getGoalById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Savings goal not found"));
    }

    public Goal createGoal(Goal goal) {
        goal.setId(null);
        return repository.save(goal);
    }

    public Goal updateGoal(Long id, Goal updatedGoal) {
        Goal existing = getGoalById(id);

        existing.setName(updatedGoal.getName());
        existing.setTargetAmount(updatedGoal.getTargetAmount());
        existing.setSavedAmount(updatedGoal.getSavedAmount());
        existing.setDeadline(updatedGoal.getDeadline());

        return repository.save(existing);
    }

    public void deleteGoal(Long id) {
        repository.delete(getGoalById(id));
    }
}
