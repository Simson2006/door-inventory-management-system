package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.UserProfile;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.Optional;
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Long findByUserRole(String userRole,Long id);

    @Query("SELECT u.userRole FROM UserProfile u WHERE u.id = :id")
    Optional<String> findUserRoleById(@Param("id") Long id);

    Page<UserProfile> findByAccountStatusAndIdNot(String accountStatus, 
        Long id,Pageable pageable);

}
