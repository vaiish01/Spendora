
package com.Spendora.spendora_backend.dashboard;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")

@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5175"
    }
)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public Map<String, Object> getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }
}
