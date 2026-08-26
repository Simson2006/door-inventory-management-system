package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.ModelEntity;
import java.util.Optional;
public interface ModelRepository extends JpaRepository<ModelEntity,Long> {


    Optional<ModelEntity> findByModelName(String modelName);

}
