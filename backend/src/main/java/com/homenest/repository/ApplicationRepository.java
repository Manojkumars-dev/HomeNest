package com.homenest.repository;

import com.homenest.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    List<Application> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    Optional<Application> findByTenantIdAndPropertyId(Long tenantId, Long propertyId);
    boolean existsByTenantIdAndPropertyId(Long tenantId, Long propertyId);
    List<Application> findByPropertyOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
