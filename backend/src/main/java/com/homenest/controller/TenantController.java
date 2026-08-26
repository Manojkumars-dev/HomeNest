package com.homenest.controller;

import com.homenest.model.*;
import com.homenest.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tenant")
public class TenantController {

    private final SavedPropertyRepository savedPropertyRepository;
    private final VisitRepository visitRepository;
    private final ApplicationRepository applicationRepository;
    private final PropertyRepository propertyRepository;

    public TenantController(SavedPropertyRepository savedPropertyRepository,
                            VisitRepository visitRepository,
                            ApplicationRepository applicationRepository,
                            PropertyRepository propertyRepository) {
        this.savedPropertyRepository = savedPropertyRepository;
        this.visitRepository = visitRepository;
        this.applicationRepository = applicationRepository;
        this.propertyRepository = propertyRepository;
    }

    // --- SAVED PROPERTIES ---

    @PostMapping("/saved/{propertyId}")
    @Transactional
    public ResponseEntity<?> toggleSavedProperty(@AuthenticationPrincipal User user, @PathVariable Long propertyId) {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Property not found"));
        }

        if (savedPropertyRepository.existsByTenantIdAndPropertyId(user.getId(), propertyId)) {
            savedPropertyRepository.deleteByTenantIdAndPropertyId(user.getId(), propertyId);
            return ResponseEntity.ok(Map.of("saved", false, "message", "Property removed from saved list"));
        } else {
            SavedProperty savedProperty = new SavedProperty(user, propertyOpt.get());
            savedPropertyRepository.save(savedProperty);
            return ResponseEntity.ok(Map.of("saved", true, "message", "Property saved"));
        }
    }

    @DeleteMapping("/saved/{propertyId}")
    @Transactional
    public ResponseEntity<?> removeSavedProperty(@AuthenticationPrincipal User user, @PathVariable Long propertyId) {
        savedPropertyRepository.deleteByTenantIdAndPropertyId(user.getId(), propertyId);
        return ResponseEntity.ok(Map.of("message", "Property removed from saved list"));
    }

    @GetMapping("/saved")
    public ResponseEntity<?> getSavedProperties(@AuthenticationPrincipal User user) {
        List<SavedProperty> savedList = savedPropertyRepository.findByTenantId(user.getId());
        List<Map<String, Object>> result = savedList.stream().map(sp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sp.getId());
            map.put("propertyId", sp.getProperty().getId());
            map.put("propertyTitle", sp.getProperty().getTitle());
            map.put("propertyCity", sp.getProperty().getCity());
            map.put("propertyRent", sp.getProperty().getRent());
            map.put("savedAt", sp.getSavedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/saved/{propertyId}/check")
    public ResponseEntity<?> checkIfSaved(@AuthenticationPrincipal User user, @PathVariable Long propertyId) {
        boolean saved = savedPropertyRepository.existsByTenantIdAndPropertyId(user.getId(), propertyId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    // --- VISITS ---

    @PostMapping("/visits")
    public ResponseEntity<?> scheduleVisit(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> payload) {
        Long propertyId = Long.valueOf(payload.get("propertyId").toString());
        String date = (String) payload.get("date");
        String time = (String) payload.get("time");
        String note = (String) payload.get("note");

        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Property not found"));
        }

        Property property = propertyOpt.get();
        Visit visit = new Visit(user, property, property.getOwner(), date, time, note);
        visitRepository.save(visit);

        return ResponseEntity.ok(Map.of("message", "Visit scheduled successfully", "visitId", visit.getId()));
    }

    @GetMapping("/visits")
    public ResponseEntity<?> getMyVisits(@AuthenticationPrincipal User user) {
        List<Visit> visits = visitRepository.findByTenantIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = visits.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("propertyId", v.getProperty().getId());
            map.put("propertyTitle", v.getProperty().getTitle());
            map.put("date", v.getDate());
            map.put("time", v.getTime());
            map.put("status", v.getStatus());
            map.put("ownerNote", v.getOwnerNote());
            map.put("createdAt", v.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/visits/{id}/cancel")
    public ResponseEntity<?> cancelVisit(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Optional<Visit> visitOpt = visitRepository.findById(id);
        if (visitOpt.isEmpty() || !visitOpt.get().getTenant().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Visit not found or unauthorized"));
        }

        Visit visit = visitOpt.get();
        visit.setStatus("CANCELLED");
        visitRepository.save(visit);

        return ResponseEntity.ok(Map.of("message", "Visit cancelled"));
    }

    // --- APPLICATIONS ---

    @PostMapping("/applications")
    public ResponseEntity<?> applyForProperty(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> payload) {
        Long propertyId = Long.valueOf(payload.get("propertyId").toString());
        String message = (String) payload.get("message");

        if (applicationRepository.existsByTenantIdAndPropertyId(user.getId(), propertyId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already applied for this property"));
        }

        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Property not found"));
        }

        Application application = new Application(user, propertyOpt.get(), message);
        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully", "applicationId", application.getId()));
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal User user) {
        List<Application> applications = applicationRepository.findByTenantIdOrderByCreatedAtDesc(user.getId());
        List<Map<String, Object>> result = applications.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("propertyId", a.getProperty().getId());
            map.put("propertyTitle", a.getProperty().getTitle());
            map.put("status", a.getStatus());
            map.put("message", a.getMessage());
            map.put("ownerResponse", a.getOwnerResponse());
            map.put("createdAt", a.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/applications/{id}/withdraw")
    public ResponseEntity<?> withdrawApplication(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty() || !appOpt.get().getTenant().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Application not found or unauthorized"));
        }

        Application application = appOpt.get();
        application.setStatus("WITHDRAWN");
        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application withdrawn"));
    }
}
