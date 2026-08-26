package com.homenest.controller;

import com.homenest.model.*;
import com.homenest.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owner")
public class OwnerActionsController {

    private final VisitRepository visitRepository;
    private final ApplicationRepository applicationRepository;

    public OwnerActionsController(VisitRepository visitRepository, ApplicationRepository applicationRepository) {
        this.visitRepository = visitRepository;
        this.applicationRepository = applicationRepository;
    }

    // --- VISIT MANAGEMENT ---

    @GetMapping("/visits")
    public ResponseEntity<?> getOwnerVisits(@AuthenticationPrincipal User user) {
        List<Visit> visits = visitRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = visits.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("propertyId", v.getProperty().getId());
            map.put("propertyTitle", v.getProperty().getTitle());
            map.put("tenantName", v.getTenant().getName());
            map.put("date", v.getDate());
            map.put("time", v.getTime());
            map.put("status", v.getStatus());
            map.put("tenantNote", v.getTenantNote());
            map.put("ownerNote", v.getOwnerNote());
            map.put("createdAt", v.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/visits/{id}/confirm")
    public ResponseEntity<?> confirmVisit(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Optional<Visit> visitOpt = visitRepository.findById(id);
        if (visitOpt.isEmpty() || !visitOpt.get().getOwner().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Visit not found or unauthorized"));
        }

        Visit visit = visitOpt.get();
        visit.setStatus("CONFIRMED");
        visitRepository.save(visit);

        return ResponseEntity.ok(Map.of("message", "Visit confirmed"));
    }

    @PutMapping("/visits/{id}/cancel")
    public ResponseEntity<?> cancelVisit(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        Optional<Visit> visitOpt = visitRepository.findById(id);
        if (visitOpt.isEmpty() || !visitOpt.get().getOwner().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Visit not found or unauthorized"));
        }

        Visit visit = visitOpt.get();
        visit.setStatus("CANCELLED");
        if (payload != null && payload.containsKey("ownerNote")) {
            visit.setOwnerNote((String) payload.get("ownerNote"));
        }
        visitRepository.save(visit);

        return ResponseEntity.ok(Map.of("message", "Visit cancelled"));
    }

    // --- APPLICATION MANAGEMENT ---

    @GetMapping("/applications")
    public ResponseEntity<?> getOwnerApplications(@AuthenticationPrincipal User user) {
        List<Application> applications = applicationRepository.findByPropertyOwnerIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = applications.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("propertyId", a.getProperty().getId());
            map.put("propertyTitle", a.getProperty().getTitle());
            map.put("tenantName", a.getTenant().getName());
            map.put("status", a.getStatus());
            map.put("message", a.getMessage());
            map.put("ownerResponse", a.getOwnerResponse());
            map.put("createdAt", a.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty() || !appOpt.get().getProperty().getOwner().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Application not found or unauthorized"));
        }

        Application application = appOpt.get();
        application.setStatus("APPROVED");
        if (payload != null && payload.containsKey("ownerResponse")) {
            application.setOwnerResponse((String) payload.get("ownerResponse"));
        }
        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application approved"));
    }

    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty() || !appOpt.get().getProperty().getOwner().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Application not found or unauthorized"));
        }

        Application application = appOpt.get();
        application.setStatus("REJECTED");
        if (payload != null && payload.containsKey("ownerResponse")) {
            application.setOwnerResponse((String) payload.get("ownerResponse"));
        }
        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application rejected"));
    }
}
