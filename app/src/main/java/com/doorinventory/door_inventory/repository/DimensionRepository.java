package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.DimensionEntity;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface DimensionRepository extends JpaRepository<DimensionEntity,Long> {
    
    @Query("""
       SELECT d.id
       FROM DimensionEntity d
       WHERE d.dimensionWidth = :width
       AND d.dimensionHeight = :height
       """)
    Optional<Long> findIdByWidthAndHeight(
            @Param("width") Double width,
            @Param("height") Double height
    );
}
