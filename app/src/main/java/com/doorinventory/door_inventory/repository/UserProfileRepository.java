package com.doorinventory.door_inventory.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.doorinventory.door_inventory.entity.UserProfileEntity;
import com.doorinventory.door_inventory.entity.enums.AccountStatusEnum;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, Long> {

    Long findByUserRole(String userRole,Long id);
    @Query("SELECT u.userRole FROM UserProfileEntity u WHERE u.id = :id")
    Optional<String> findUserRoleById(@Param("id") Long id);

    Page<UserProfileEntity> findByAccountStatusInAndIdNot(
        List<AccountStatusEnum> accountStatuses,
        Long id,
        Pageable pageable);

     Page<UserProfileEntity> findByAccountStatusAndIdNot(
        AccountStatusEnum accountStatus,
        Long id,
        Pageable pageable);
}
