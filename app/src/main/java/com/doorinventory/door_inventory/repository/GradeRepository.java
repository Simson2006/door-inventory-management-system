package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.GradeEntity;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface GradeRepository extends JpaRepository<GradeEntity,Long> {
    
    @Query("SELECT g.id FROM GradeEntity g WHERE g.gradeName= :name")
    Optional<Long> findIdByGradeName(@Param("name") String gradeName);
}
