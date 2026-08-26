package com.homenest.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String city;

    private String locality;
    private String address;
    private String pincode;
    private String landmark;

    private int bhk = 2;
    private int area;
    private String floor;
    private String totalFloors;
    private String facing;

    @Column(nullable = false)
    private int rent;
    private int deposit;
    private String availableFrom;

    private boolean rentNegotiable = false;
    private String type;
    private String furnished;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String preferredTenant;
    private boolean petsAllowed;
    private boolean smokingAllowed;
    private boolean bachelorAllowed = true;

    private String status = "ACTIVE";
    private boolean verified = false;
    private int views = 0;
    private int inquiries = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "property_furnishing_items", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "item")
    private List<String> furnishingItems = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Property() {}

    private Property(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.city = builder.city;
        this.locality = builder.locality;
        this.address = builder.address;
        this.pincode = builder.pincode;
        this.landmark = builder.landmark;
        this.bhk = builder.bhk;
        this.area = builder.area;
        this.floor = builder.floor;
        this.totalFloors = builder.totalFloors;
        this.facing = builder.facing;
        this.rent = builder.rent;
        this.deposit = builder.deposit;
        this.availableFrom = builder.availableFrom;
        this.rentNegotiable = builder.rentNegotiable;
        this.type = builder.type;
        this.furnished = builder.furnished;
        this.description = builder.description;
        this.preferredTenant = builder.preferredTenant;
        this.petsAllowed = builder.petsAllowed;
        this.smokingAllowed = builder.smokingAllowed;
        this.bachelorAllowed = builder.bachelorAllowed;
        this.status = builder.status != null ? builder.status : "ACTIVE";
        this.verified = builder.verified;
        this.views = builder.views;
        this.inquiries = builder.inquiries;
        this.owner = builder.owner;
        this.amenities = builder.amenities != null ? builder.amenities : new ArrayList<>();
        this.furnishingItems = builder.furnishingItems != null ? builder.furnishingItems : new ArrayList<>();
        this.images = builder.images != null ? builder.images : new ArrayList<>();
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
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

    // Builder Class
    public static class Builder {
        private Long id;
        private String title;
        private String city;
        private String locality;
        private String address;
        private String pincode;
        private String landmark;
        private int bhk = 2;
        private int area;
        private String floor;
        private String totalFloors;
        private String facing;
        private int rent;
        private int deposit;
        private String availableFrom;
        private boolean rentNegotiable = false;
        private String type;
        private String furnished;
        private String description;
        private String preferredTenant;
        private boolean petsAllowed;
        private boolean smokingAllowed;
        private boolean bachelorAllowed = true;
        private String status = "ACTIVE";
        private boolean verified = false;
        private int views = 0;
        private int inquiries = 0;
        private User owner;
        private List<String> amenities;
        private List<String> furnishingItems;
        private List<String> images;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder locality(String locality) { this.locality = locality; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder pincode(String pincode) { this.pincode = pincode; return this; }
        public Builder landmark(String landmark) { this.landmark = landmark; return this; }
        public Builder bhk(int bhk) { this.bhk = bhk; return this; }
        public Builder area(int area) { this.area = area; return this; }
        public Builder floor(String floor) { this.floor = floor; return this; }
        public Builder totalFloors(String totalFloors) { this.totalFloors = totalFloors; return this; }
        public Builder facing(String facing) { this.facing = facing; return this; }
        public Builder rent(int rent) { this.rent = rent; return this; }
        public Builder deposit(int deposit) { this.deposit = deposit; return this; }
        public Builder availableFrom(String availableFrom) { this.availableFrom = availableFrom; return this; }
        public Builder rentNegotiable(boolean rentNegotiable) { this.rentNegotiable = rentNegotiable; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder furnished(String furnished) { this.furnished = furnished; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder preferredTenant(String preferredTenant) { this.preferredTenant = preferredTenant; return this; }
        public Builder petsAllowed(boolean petsAllowed) { this.petsAllowed = petsAllowed; return this; }
        public Builder smokingAllowed(boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; return this; }
        public Builder bachelorAllowed(boolean bachelorAllowed) { this.bachelorAllowed = bachelorAllowed; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder verified(boolean verified) { this.verified = verified; return this; }
        public Builder views(int views) { this.views = views; return this; }
        public Builder inquiries(int inquiries) { this.inquiries = inquiries; return this; }
        public Builder owner(User owner) { this.owner = owner; return this; }
        public Builder amenities(List<String> amenities) { this.amenities = amenities; return this; }
        public Builder furnishingItems(List<String> furnishingItems) { this.furnishingItems = furnishingItems; return this; }
        public Builder images(List<String> images) { this.images = images; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Property build() {
            return new Property(this);
        }
    }
}
