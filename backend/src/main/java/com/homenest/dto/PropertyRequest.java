package com.homenest.dto;

import java.util.List;

public class PropertyRequest {
    private String title;
    private String type;
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
    private String furnished;
    private List<String> furnishingItems;
    private List<String> amenities;
    private String preferredTenant;
    private boolean petsAllowed;
    private boolean smokingAllowed;
    private boolean bachelorAllowed;
    private String description;
    private List<String> images;

    public PropertyRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

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

    public String getFurnished() { return furnished; }
    public void setFurnished(String furnished) { this.furnished = furnished; }

    public List<String> getFurnishingItems() { return furnishingItems; }
    public void setFurnishingItems(List<String> furnishingItems) { this.furnishingItems = furnishingItems; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public String getPreferredTenant() { return preferredTenant; }
    public void setPreferredTenant(String preferredTenant) { this.preferredTenant = preferredTenant; }

    public boolean isPetsAllowed() { return petsAllowed; }
    public void setPetsAllowed(boolean petsAllowed) { this.petsAllowed = petsAllowed; }

    public boolean isSmokingAllowed() { return smokingAllowed; }
    public void setSmokingAllowed(boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; }

    public boolean isBachelorAllowed() { return bachelorAllowed; }
    public void setBachelorAllowed(boolean bachelorAllowed) { this.bachelorAllowed = bachelorAllowed; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
