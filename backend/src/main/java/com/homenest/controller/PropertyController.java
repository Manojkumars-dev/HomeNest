package com.homenest.controller;

import com.homenest.dto.PropertyRequest;
import com.homenest.dto.PropertyResponse;
import com.homenest.model.User;
import com.homenest.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // PUBLIC ENDPOINTS

    @GetMapping("/properties")
    public ResponseEntity<List<PropertyResponse>> getAllActiveProperties() {
        return ResponseEntity.ok(propertyService.getAllActiveProperties());
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/properties/search")
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minRent,
            @RequestParam(required = false) Integer maxRent,
            @RequestParam(required = false) Integer bhk,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String furnished) {
        return ResponseEntity.ok(propertyService.searchProperties(city, minRent, maxRent, bhk, type, furnished));
    }

    // OWNER ONLY ENDPOINTS

    @PostMapping("/owner/properties")
    public ResponseEntity<PropertyResponse> createProperty(
            @RequestBody PropertyRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(propertyService.createProperty(req, user.getEmail()));
    }

    @GetMapping("/owner/properties")
    public ResponseEntity<List<PropertyResponse>> getOwnerProperties(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(propertyService.getOwnerProperties(user.getEmail()));
    }

    @PutMapping("/owner/properties/{id}")
    public ResponseEntity<Void> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequest req,
            @AuthenticationPrincipal User user) {
        propertyService.updateProperty(id, req, user.getEmail());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/owner/properties/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        propertyService.deleteProperty(id, user.getEmail());
        return ResponseEntity.ok().build();
    }
}
