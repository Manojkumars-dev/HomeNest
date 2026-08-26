package com.homenest.repository;

import com.homenest.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    List<Visit> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Visit> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
}
