package com.homenest.repository;

import com.homenest.model.SavedProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPropertyRepository extends JpaRepository<SavedProperty, Long> {
    List<SavedProperty> findByTenantId(Long tenantId);
    Optional<SavedProperty> findByTenantIdAndPropertyId(Long tenantId, Long propertyId);
    boolean existsByTenantIdAndPropertyId(Long tenantId, Long propertyId);
    void deleteByTenantIdAndPropertyId(Long tenantId, Long propertyId);
}
