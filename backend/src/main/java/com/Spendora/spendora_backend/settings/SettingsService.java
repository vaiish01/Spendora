
package com.Spendora.spendora_backend.settings;

import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

    public Settings getSettings() {
        return repository.findById(1L)
                .orElseGet(() -> {
                    Settings settings = new Settings();
                    settings.setId(1L);
                    return repository.save(settings);
                });
    }

    public Settings updateSettings(Settings updated) {
        Settings settings = getSettings();

        if (updated.getCurrency() == null
                || !updated.getCurrency().matches("INR|USD|GBP|EUR")) {
            throw new IllegalArgumentException(
                    "Currency must be INR, USD, GBP, or EUR");
        }

        settings.setCurrency(updated.getCurrency());
        settings.setDarkMode(updated.isDarkMode());
        settings.setNotificationsEnabled(
                updated.isNotificationsEnabled());

        return repository.save(settings);
    }
}
