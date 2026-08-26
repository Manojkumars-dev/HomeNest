package com.homenest.service;

import com.homenest.dto.PropertyRequest;
import com.homenest.dto.PropertyResponse;
import com.homenest.model.Property;
import com.homenest.model.User;
import com.homenest.repository.PropertyRepository;
import com.homenest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    public PropertyResponse createProperty(PropertyRequest req, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Auto-generate title if not provided: "2 BHK Apartment in Mumbai"
        String title = req.getTitle();
        if (title == null || title.isBlank()) {
            title = req.getBhk() + " BHK " +
                    (req.getType() != null ? req.getType() : "Property") +
                    " in " +
                    (req.getLocality() != null ? req.getLocality() : req.getCity());
        }

        Property property = Property.builder()
                .title(title)
                .city(req.getCity())
                .locality(req.getLocality())
                .address(req.getAddress())
                .pincode(req.getPincode())
                .landmark(req.getLandmark())
                .bhk(req.getBhk())
                .area(req.getArea())
                .floor(req.getFloor())
                .totalFloors(req.getTotalFloors())
                .facing(req.getFacing())
                .rent(req.getRent())
                .deposit(req.getDeposit())
                .availableFrom(req.getAvailableFrom())
                .rentNegotiable(req.isRentNegotiable())
                .type(req.getType())
                .furnished(req.getFurnished())
                .description(req.getDescription())
                .preferredTenant(req.getPreferredTenant())
                .petsAllowed(req.isPetsAllowed())
                .smokingAllowed(req.isSmokingAllowed())
                .bachelorAllowed(req.isBachelorAllowed())
                .owner(owner)
                .amenities(req.getAmenities())
                .furnishingItems(req.getFurnishingItems())
                .images(req.getImages())
                .build();

        Property saved = propertyRepository.save(property);
        return PropertyResponse.fromEntity(saved);
    }

    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        property.setViews(property.getViews() + 1);
        propertyRepository.save(property);
        
        return PropertyResponse.fromEntity(property);
    }

    public List<PropertyResponse> searchProperties(String city, Integer minRent, Integer maxRent, Integer bhk, String type, String furnished) {
        List<Property> properties = propertyRepository.searchProperties(city, minRent, maxRent, bhk, type, furnished);
        return properties.stream().map(PropertyResponse::fromEntity).collect(Collectors.toList());
    }

    public List<PropertyResponse> getOwnerProperties(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        List<Property> properties = propertyRepository.findByOwner(owner);
        return properties.stream().map(PropertyResponse::fromEntity).collect(Collectors.toList());
    }

    public void updateProperty(Long id, PropertyRequest req, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
                
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
                
        if (!property.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to update this property");
        }
        
        property.setTitle(req.getTitle());
        property.setCity(req.getCity());
        property.setLocality(req.getLocality());
        property.setAddress(req.getAddress());
        property.setPincode(req.getPincode());
        property.setLandmark(req.getLandmark());
        property.setBhk(req.getBhk());
        property.setArea(req.getArea());
        property.setFloor(req.getFloor());
        property.setTotalFloors(req.getTotalFloors());
        property.setFacing(req.getFacing());
        property.setRent(req.getRent());
        property.setDeposit(req.getDeposit());
        property.setAvailableFrom(req.getAvailableFrom());
        property.setRentNegotiable(req.isRentNegotiable());
        property.setType(req.getType());
        property.setFurnished(req.getFurnished());
        property.setDescription(req.getDescription());
        property.setPreferredTenant(req.getPreferredTenant());
        property.setPetsAllowed(req.isPetsAllowed());
        property.setSmokingAllowed(req.isSmokingAllowed());
        property.setBachelorAllowed(req.isBachelorAllowed());
        property.setAmenities(req.getAmenities());
        property.setFurnishingItems(req.getFurnishingItems());
        property.setImages(req.getImages());
        
        propertyRepository.save(property);
    }

    public void deleteProperty(Long id, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
                
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
                
        if (!property.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to delete this property");
        }
        
        property.setStatus("DELETED");
        propertyRepository.save(property);
    }

    public List<PropertyResponse> getAllActiveProperties() {
        List<Property> properties = propertyRepository.findByStatusAndVerified("ACTIVE", true);
        return properties.stream().map(PropertyResponse::fromEntity).collect(Collectors.toList());
    }
}
