package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.ModelEntity;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface ModelRepository extends JpaRepository<ModelEntity,Long> {

    @Query("SELECT m.id FROM ModelEntity m where m.modelName=:name")
    Optional<Long> findIdByModelName(@Param("name") String modelName);

}
