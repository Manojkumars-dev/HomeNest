package com.homenest.dto;

import com.homenest.model.Property;
import com.homenest.model.User;
import java.time.LocalDateTime;
import java.util.List;

public class PropertyResponse {
    private Long id;
    private String title;
    private String city;
    private String locality;
    private String address;
    private String pincode;
    private String landmark;
    private int bhk;
    private int area;
    private String floor;
    private String totalFloors;
    private String facing;
    private int rent;
    private int deposit;
    private String availableFrom;
    private boolean rentNegotiable;
    private String type;
    private String furnished;
    private String description;
    private String preferredTenant;
    private boolean petsAllowed;
    private boolean smokingAllowed;
    private boolean bachelorAllowed;
    private String status;
    private boolean verified;
    private int views;
    private int inquiries;
    private List<String> amenities;
    private List<String> furnishingItems;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Added fields
    private Long ownerId;
    private String ownerName;
    private String ownerPhone;

    public PropertyResponse() {}

    public static PropertyResponse fromEntity(Property p) {
        PropertyResponse res = new PropertyResponse();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setCity(p.getCity());
        res.setLocality(p.getLocality());
        res.setAddress(p.getAddress());
        res.setPincode(p.getPincode());
        res.setLandmark(p.getLandmark());
        res.setBhk(p.getBhk());
        res.setArea(p.getArea());
        res.setFloor(p.getFloor());
        res.setTotalFloors(p.getTotalFloors());
        res.setFacing(p.getFacing());
        res.setRent(p.getRent());
        res.setDeposit(p.getDeposit());
        res.setAvailableFrom(p.getAvailableFrom());
        res.setRentNegotiable(p.isRentNegotiable());
        res.setType(p.getType());
        res.setFurnished(p.getFurnished());
        res.setDescription(p.getDescription());
        res.setPreferredTenant(p.getPreferredTenant());
        res.setPetsAllowed(p.isPetsAllowed());
        res.setSmokingAllowed(p.isSmokingAllowed());
        res.setBachelorAllowed(p.isBachelorAllowed());
        res.setStatus(p.getStatus());
        res.setVerified(p.isVerified());
        res.setViews(p.getViews());
        res.setInquiries(p.getInquiries());
        res.setAmenities(p.getAmenities());
        res.setFurnishingItems(p.getFurnishingItems());
        res.setImages(p.getImages());
        res.setCreatedAt(p.getCreatedAt());
        res.setUpdatedAt(p.getUpdatedAt());

        User owner = p.getOwner();
        if (owner != null) {
            res.setOwnerId(owner.getId());
            res.setOwnerName(owner.getName());
            
            String phone = owner.getPhone();
            if (phone != null && phone.length() >= 5) {
                res.setOwnerPhone(phone.substring(0, 5) + "*****");
            } else {
                res.setOwnerPhone("*****");
            }
        }
        return res;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public int getBhk() { return bhk; }
    public void setBhk(int bhk) { this.bhk = bhk; }
    public int getArea() { return area; }
    public void setArea(int area) { this.area = area; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public String getTotalFloors() { return totalFloors; }
    public void setTotalFloors(String totalFloors) { this.totalFloors = totalFloors; }
    public String getFacing() { return facing; }
    public void setFacing(String facing) { this.facing = facing; }
    public int getRent() { return rent; }
    public void setRent(int rent) { this.rent = rent; }
    public int getDeposit() { return deposit; }
    public void setDeposit(int deposit) { this.deposit = deposit; }
    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }
    public boolean isRentNegotiable() { return rentNegotiable; }
    public void setRentNegotiable(boolean rentNegotiable) { this.rentNegotiable = rentNegotiable; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFurnished() { return furnished; }
    public void setFurnished(String furnished) { this.furnished = furnished; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPreferredTenant() { return preferredTenant; }
    public void setPreferredTenant(String preferredTenant) { this.preferredTenant = preferredTenant; }
    public boolean isPetsAllowed() { return petsAllowed; }
    public void setPetsAllowed(boolean petsAllowed) { this.petsAllowed = petsAllowed; }
    public boolean isSmokingAllowed() { return smokingAllowed; }
    public void setSmokingAllowed(boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; }
    public boolean isBachelorAllowed() { return bachelorAllowed; }
    public void setBachelorAllowed(boolean bachelorAllowed) { this.bachelorAllowed = bachelorAllowed; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }
    public int getInquiries() { return inquiries; }
    public void setInquiries(int inquiries) { this.inquiries = inquiries; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public List<String> getFurnishingItems() { return furnishingItems; }
    public void setFurnishingItems(List<String> furnishingItems) { this.furnishingItems = furnishingItems; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }
}
