package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.UserProfileEntity;
import com.doorinventory.door_inventory.entity.enums.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {

    Long findByUserRole(String userRole,Long id);
    @Query("SELECT u.userRole FROM UserProfileEntity u WHERE u.id = :id")
    Optional<String> findUserRoleById(@Param("id") Long id);

    Page<UserProfileEntity> findByAccountStatusAndIdNot(AccountStatusEnum accountStatus, 
        Long id,Pageable pageable);

}
