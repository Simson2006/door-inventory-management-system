package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.InventoryEntity;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryEntity,Long>{
    Optional<InventoryEntity> findByModelIdAndGradeIdAndDimensionId(
        Long modelId,
        Long gradeId,
        Long dimensionId
);
    boolean existsByModelId(Long modelId);
    boolean existsByGradeId(Long gradeId);

}
