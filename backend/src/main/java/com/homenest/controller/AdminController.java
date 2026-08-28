package com.homenest.controller;

import com.homenest.model.Property;
import com.homenest.model.User;
import com.homenest.repository.ApplicationRepository;
import com.homenest.repository.PropertyRepository;
import com.homenest.repository.UserRepository;
import com.homenest.repository.VisitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final VisitRepository visitRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(UserRepository userRepository, PropertyRepository propertyRepository,
                          VisitRepository visitRepository, ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.visitRepository = visitRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProperties", propertyRepository.count());
        stats.put("totalVisits", visitRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("activeProperties", propertyRepository.count());
        stats.put("pendingVisits", visitRepository.count());

        // Recent users (last 5) — map to safe DTOs
        List<Map<String, Object>> recentUsers = userRepository.findAll().stream()
            .sorted((a, b) -> b.getId().compareTo(a.getId()))
            .limit(5)
            .map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("email", u.getEmail());
                m.put("role", u.getRole().name());
                m.put("createdAt", u.getCreatedAt());
                return m;
            })
            .collect(Collectors.toList());
        stats.put("recentUsers", recentUsers);

        // Recent properties (last 5) — map to safe DTOs
        List<Map<String, Object>> recentProperties = propertyRepository.findAll().stream()
            .sorted((a, b) -> b.getId().compareTo(a.getId()))
            .limit(5)
            .map(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", p.getId());
                m.put("title", p.getTitle());
                m.put("city", p.getCity());
                m.put("rent", p.getRent());
                m.put("status", p.getStatus());
                return m;
            })
            .collect(Collectors.toList());
        stats.put("recentProperties", recentProperties);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("email", u.getEmail());
                m.put("phone", u.getPhone());
                m.put("role", u.getRole().name());
                m.put("active", u.isActive());
                m.put("verified", u.isVerified());
                m.put("createdAt", u.getCreatedAt());
                return m;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleActive(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Admin accounts cannot be banned");
        }
        user.setActive(!user.isActive());
        userRepository.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("active", user.isActive());
        result.put("message", user.isActive() ? "User activated" : "User banned");
        return ResponseEntity.ok(result);
    }

    @PutMapping("/users/{id}/toggle-verified")
    public ResponseEntity<Map<String, Object>> toggleVerified(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Admin accounts cannot be modified");
        }
        user.setVerified(!user.isVerified());
        userRepository.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("verified", user.isVerified());
        result.put("message", user.isVerified() ? "User verified" : "User unverified");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/properties")
    public ResponseEntity<List<Map<String, Object>>> getProperties() {
        List<Map<String, Object>> properties = propertyRepository.findAll().stream()
            .map(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", p.getId());
                m.put("title", p.getTitle());
                m.put("city", p.getCity());
                m.put("locality", p.getLocality());
                m.put("rent", p.getRent());
                m.put("bhk", p.getBhk());
                m.put("type", p.getType());
                m.put("status", p.getStatus());
                m.put("verified", p.isVerified());
                m.put("ownerName", p.getOwner() != null ? p.getOwner().getName() : "Unknown");
                m.put("createdAt", p.getCreatedAt());
                return m;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/properties/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyProperty(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setVerified(true);
        propertyRepository.save(property);
        Map<String, Object> result = new HashMap<>();
        result.put("id", property.getId());
        result.put("verified", true);
        result.put("message", "Property verified");
        return ResponseEntity.ok(result);
    }

    @PutMapping("/properties/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectProperty(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus("REJECTED");
        propertyRepository.save(property);
        Map<String, Object> result = new HashMap<>();
        result.put("id", property.getId());
        result.put("status", "REJECTED");
        result.put("message", "Property rejected");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/properties/{id}")
    public ResponseEntity<Map<String, String>> deleteProperty(@PathVariable Long id) {
        propertyRepository.deleteById(id);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Property deleted");
        return ResponseEntity.ok(result);
    }
}
