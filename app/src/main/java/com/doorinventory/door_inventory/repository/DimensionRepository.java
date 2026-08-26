package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.DimensionEntity;
import java.util.Optional;

public interface DimensionRepository extends JpaRepository<DimensionEntity,Long> {
    
    Optional<DimensionEntity> findByDimensionWidthAndDimensionHeight(
            Double width,
            Double height);
}

