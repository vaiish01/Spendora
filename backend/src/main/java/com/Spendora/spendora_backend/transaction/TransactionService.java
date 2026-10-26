
package com.Spendora.spendora_backend.transaction;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found with id: " + id));
    }

    public Transaction createTransaction(Transaction transaction) {
        transaction.setId(null);
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Transaction existing = getTransactionById(id);

        existing.setTitle(updatedTransaction.getTitle());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setType(updatedTransaction.getType());
        existing.setCategory(updatedTransaction.getCategory());
        existing.setDate(updatedTransaction.getDate());
        existing.setNotes(updatedTransaction.getNotes());

        return transactionRepository.save(existing);
    }

    public void deleteTransaction(Long id) {
        Transaction existing = getTransactionById(id);
        transactionRepository.delete(existing);
    }
}
