package com.homenest.config;

import com.homenest.model.Property;
import com.homenest.model.User;
import com.homenest.repository.PropertyRepository;
import com.homenest.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PropertyRepository propertyRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure a default Owner user exists
        User owner = userRepository.findByEmail("priya.owner@homenest.com").orElseGet(() -> {
            User newOwner = User.builder()
                    .name("Priya Sharma")
                    .email("priya.owner@homenest.com")
                    .password(passwordEncoder.encode("Priya@123"))
                    .phone("9876501234")
                    .role(User.Role.OWNER)
                    .active(true)
                    .verified(true)
                    .build();
            return userRepository.save(newOwner);
        });

        // 2. Ensure a default Admin user exists
        if (!userRepository.existsByEmail("admin@homenest.com")) {
            User admin = User.builder()
                    .name("HomeNest Admin")
                    .email("admin@homenest.com")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .phone("9999999999")
                    .role(User.Role.ADMIN)
                    .active(true)
                    .verified(true)
                    .build();
            userRepository.save(admin);
        }

        // 3. Seed demo properties if database has fewer than 5 properties
        if (propertyRepository.count() < 5) {
            seedDemoProperties(owner);
        }
    }

    private void seedDemoProperties(User owner) {
        List<Property> properties = Arrays.asList(
                // 1. Apartment - Mumbai
                Property.builder()
                        .title("Modern 2 BHK Sea-Breeze Apartment in Bandra West")
                        .city("Mumbai")
                        .locality("Bandra West")
                        .address("Hill Road, Near Bandstand")
                        .pincode("400050")
                        .landmark("Near Mehboob Studio")
                        .bhk(2)
                        .area(950)
                        .floor("7")
                        .totalFloors("14")
                        .facing("West")
                        .rent(65000)
                        .deposit(150000)
                        .availableFrom("Immediate")
                        .rentNegotiable(true)
                        .type("Apartment")
                        .furnished("Fully Furnished")
                        .description("Stunning sea-facing 2 BHK flat in prime Bandra West. Sunlit living room, modular kitchen, Italian marble flooring, and 24/7 security. Walking distance from cafe culture and promenades.")
                        .preferredTenant("Any")
                        .petsAllowed(true)
                        .smokingAllowed(false)
                        .bachelorAllowed(true)
                        .status("ACTIVE")
                        .verified(true)
                        .views(142)
                        .inquiries(18)
                        .owner(owner)
                        .amenities(Arrays.asList("Lift", "Gym", "Swimming Pool", "Covered Parking", "Security", "Power Backup", "Wi-Fi", "Clubhouse"))
                        .furnishingItems(Arrays.asList("Sofa", "Dining Table", "Smart TV", "Double Bed", "Wardrobes", "Refrigerator", "AC", "Microwave", "Washing Machine"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build(),

                // 2. Villa - Bangalore
                Property.builder()
                        .title("Luxurious 4 BHK Gated Villa with Private Garden")
                        .city("Bangalore")
                        .locality("Whitefield")
                        .address("Prestige Boulevard, ECC Road")
                        .pincode("560066")
                        .landmark("Near ITPL Metro Station")
                        .bhk(4)
                        .area(3200)
                        .floor("G+2")
                        .totalFloors("2")
                        .facing("East")
                        .rent(95000)
                        .deposit(300000)
                        .availableFrom("1st of next month")
                        .rentNegotiable(false)
                        .type("Villa")
                        .furnished("Semi Furnished")
                        .description("Grand standalone villa inside a premium gated community. Features a private lawn, high ceilings, servant quarter, and 2 car parking spaces. Close to top international schools and tech parks.")
                        .preferredTenant("Family")
                        .petsAllowed(true)
                        .smokingAllowed(false)
                        .bachelorAllowed(false)
                        .status("ACTIVE")
                        .verified(true)
                        .views(280)
                        .inquiries(32)
                        .owner(owner)
                        .amenities(Arrays.asList("Private Garden", "Clubhouse", "Tennis Court", "Swimming Pool", "24/7 Security", "Gated Community", "Kids Play Area"))
                        .furnishingItems(Arrays.asList("Modular Kitchen", "Chimney", "Built-in Wardrobes", "Geysers", "Solar Water Heater"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build(),

                // 3. Studio / 1RK - Bangalore
                Property.builder()
                        .title("Chic Designer Studio Flat in Koramangala")
                        .city("Bangalore")
                        .locality("Koramangala 4th Block")
                        .address("80 Feet Road, Near Sony World Signal")
                        .pincode("560034")
                        .landmark("Opposite Starbucks")
                        .bhk(1)
                        .area(480)
                        .floor("3")
                        .totalFloors("4")
                        .facing("North")
                        .rent(28000)
                        .deposit(60000)
                        .availableFrom("Immediate")
                        .rentNegotiable(true)
                        .type("Studio")
                        .furnished("Fully Furnished")
                        .description("Compact, aesthetic studio apartment tailored for working professionals and founders. High-speed 300 Mbps broadband setup, workstation desk, mini-kitchenette, and smart home lighting.")
                        .preferredTenant("Bachelors / Working Professionals")
                        .petsAllowed(false)
                        .smokingAllowed(false)
                        .bachelorAllowed(true)
                        .status("ACTIVE")
                        .verified(true)
                        .views(310)
                        .inquiries(45)
                        .owner(owner)
                        .amenities(Arrays.asList("High Speed Wi-Fi", "Lift", "CCTV", "Power Backup", "Housekeeping", "Terrace Lounge"))
                        .furnishingItems(Arrays.asList("Ergonomic Chair", "Work Desk", "Queen Bed", "Mini Fridge", "Microwave", "Smart TV", "Geyser"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build(),

                // 4. PG / Co-living - Pune
                Property.builder()
                        .title("Premium Co-Living Private Suite with Meals Included")
                        .city("Pune")
                        .locality("Viman Nagar")
                        .address("Symbiosis Road, Clover Park")
                        .pincode("411014")
                        .landmark("Near Phoenix Marketcity")
                        .bhk(1)
                        .area(300)
                        .floor("2")
                        .totalFloors("5")
                        .facing("East")
                        .rent(16500)
                        .deposit(25000)
                        .availableFrom("Immediate")
                        .rentNegotiable(false)
                        .type("PG")
                        .furnished("Fully Furnished")
                        .description("Hassle-free luxury PG room with attached washroom and private balcony. Rent covers 3-time chef meals, high-speed WiFi, laundry, and daily housekeeping.")
                        .preferredTenant("Students / Working Professionals")
                        .petsAllowed(false)
                        .smokingAllowed(false)
                        .bachelorAllowed(true)
                        .status("ACTIVE")
                        .verified(true)
                        .views(195)
                        .inquiries(27)
                        .owner(owner)
                        .amenities(Arrays.asList("Meals Included", "Housekeeping", "Laundry", "Gym", "Gaming Zone", "Biometric Entry", "24/7 Security"))
                        .furnishingItems(Arrays.asList("Single Bed with Mattress", "Study Table", "Wardrobe", "AC", "Geyser", "Mini Fridge"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build(),

                // 5. Independent House - Hyderabad
                Property.builder()
                        .title("Serene 3 BHK Independent Builder Floor with Terrace")
                        .city("Hyderabad")
                        .locality("Jubilee Hills")
                        .address("Road No. 36, Near Checkpost")
                        .pincode("500033")
                        .landmark("Near Peddamma Temple")
                        .bhk(3)
                        .area(2100)
                        .floor("1")
                        .totalFloors("3")
                        .facing("North-East")
                        .rent(52000)
                        .deposit(120000)
                        .availableFrom("Immediate")
                        .rentNegotiable(true)
                        .type("House")
                        .furnished("Semi Furnished")
                        .description("Peaceful and airy independent floor with exclusive private terrace access. Vastu compliant, large sit-out balcony, teak wood finishes, and reserved ground-floor parking.")
                        .preferredTenant("Family")
                        .petsAllowed(true)
                        .smokingAllowed(false)
                        .bachelorAllowed(true)
                        .status("ACTIVE")
                        .verified(true)
                        .views(165)
                        .inquiries(19)
                        .owner(owner)
                        .amenities(Arrays.asList("Private Terrace", "Covered Parking", "Water Storage", "Security", "Power Backup"))
                        .furnishingItems(Arrays.asList("Modular Kitchen", "Wardrobes", "Fans & Lights", "Geysers"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build(),

                // 6. Apartment - Delhi NCR / Gurgaon
                Property.builder()
                        .title("Contemporary 3 BHK Golf-Course View Condominium")
                        .city("Delhi NCR")
                        .locality("Golf Course Road, Gurgaon")
                        .address("DLF Phase 5")
                        .pincode("122002")
                        .landmark("Near Sector 54 Metro")
                        .bhk(3)
                        .area(1850)
                        .floor("12")
                        .totalFloors("26")
                        .facing("East")
                        .rent(78000)
                        .deposit(160000)
                        .availableFrom("Immediate")
                        .rentNegotiable(false)
                        .type("Apartment")
                        .furnished("Fully Furnished")
                        .description("Ultra-modern high-rise apartment on prestigious Golf Course Road. Panoramic skyline views, central air conditioning, German modular kitchen fittings, and 5-star concierge service.")
                        .preferredTenant("Corporate / Family")
                        .petsAllowed(true)
                        .smokingAllowed(false)
                        .bachelorAllowed(true)
                        .status("ACTIVE")
                        .verified(true)
                        .views(240)
                        .inquiries(36)
                        .owner(owner)
                        .amenities(Arrays.asList("Concierge", "Infinity Pool", "Squash Court", "Gym", "Spa", "EV Charging", "Covered Parking", "Central AC"))
                        .furnishingItems(Arrays.asList("Leather Recliners", "Dining Set", "King Beds", "Dishwasher", "Oven", "Washing Machine", "Home Theater"))
                        .images(Arrays.asList(
                                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
                        ))
                        .build()
        );

        propertyRepository.saveAll(properties);
    }
}
