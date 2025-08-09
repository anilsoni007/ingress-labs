package com.ingresslab.admin;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "admin-service");
        response.put("version", "1.0.0");
        response.put("timestamp", new Date());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalUsers", 150);
        dashboard.put("totalProducts", 45);
        dashboard.put("totalOrders", 320);
        dashboard.put("revenue", 15750.50);
        
        List<Map<String, Object>> recentActivity = Arrays.asList(
            Map.of("action", "User registered", "timestamp", "2024-01-15T10:30:00Z"),
            Map.of("action", "Product updated", "timestamp", "2024-01-15T10:25:00Z"),
            Map.of("action", "Order completed", "timestamp", "2024-01-15T10:20:00Z")
        );
        dashboard.put("recentActivity", recentActivity);
        
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = Arrays.asList(
            Map.of("id", 1, "name", "Admin User", "email", "admin@example.com", "role", "admin", "status", "active"),
            Map.of("id", 2, "name", "John Manager", "email", "john@example.com", "role", "manager", "status", "active"),
            Map.of("id", 3, "name", "Jane Moderator", "email", "jane@example.com", "role", "moderator", "status", "inactive")
        );
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{id}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Map<String, String> response = new HashMap<>();
        response.put("message", "User " + id + " status updated to " + status);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("javaVersion", System.getProperty("java.version"));
        systemInfo.put("springBootVersion", "3.1.0");
        systemInfo.put("uptime", System.currentTimeMillis());
        systemInfo.put("memoryUsage", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory());
        systemInfo.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        return ResponseEntity.ok(systemInfo);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        List<Map<String, Object>> logs = Arrays.asList(
            Map.of("level", "INFO", "message", "Admin service started", "timestamp", "2024-01-15T09:00:00Z"),
            Map.of("level", "WARN", "message", "High memory usage detected", "timestamp", "2024-01-15T09:15:00Z"),
            Map.of("level", "ERROR", "message", "Database connection timeout", "timestamp", "2024-01-15T09:30:00Z"),
            Map.of("level", "INFO", "message", "User authentication successful", "timestamp", "2024-01-15T09:45:00Z")
        );
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/maintenance")
    public ResponseEntity<Map<String, String>> toggleMaintenance(@RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        Map<String, String> response = new HashMap<>();
        response.put("message", "Maintenance mode " + (enabled ? "enabled" : "disabled"));
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}