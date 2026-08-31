package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.GradeEntity;
import java.util.Optional;


public interface GradeRepository extends JpaRepository<GradeEntity,Long> {
    
    Optional<GradeEntity> findByGradeName(String gradeName);
    boolean existsByGradeName(String gradeName);
}
