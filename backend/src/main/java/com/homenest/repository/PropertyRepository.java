package com.homenest.repository;

import com.homenest.model.Property;
import com.homenest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByOwnerIdAndStatusNot(Long ownerId, String status);

    List<Property> findByOwner(User owner);

    List<Property> findByStatusAndVerified(String status, boolean verified);

    boolean existsByTitle(String title);

    @Query("SELECT p FROM Property p WHERE " +
           "(:city IS NULL OR p.city = :city) AND " +
           "(:minRent IS NULL OR p.rent >= :minRent) AND " +
           "(:maxRent IS NULL OR p.rent <= :maxRent) AND " +
           "(:bhk IS NULL OR p.bhk = :bhk) AND " +
           "(:type IS NULL OR p.type = :type) AND " +
           "(:furnished IS NULL OR p.furnished = :furnished) AND " +
           "p.status = 'ACTIVE' " +
           "ORDER BY p.createdAt DESC")
    List<Property> searchProperties(
            @Param("city") String city,
            @Param("minRent") Integer minRent,
            @Param("maxRent") Integer maxRent,
            @Param("bhk") Integer bhk,
            @Param("type") String type,
            @Param("furnished") String furnished
    );
}
