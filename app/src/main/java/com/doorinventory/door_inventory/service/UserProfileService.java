package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;
import com.doorinventory.door_inventory.repository.UserProfileRepository;
import com.doorinventory.door_inventory.entity.UserProfile;
import com.doorinventory.door_inventory.exception.UserNotFoundException;
import com.doorinventory.door_inventory.exception.AdminAccessDeniedException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class UserProfileService{

    private final UserProfileRepository userProfileRepository;
    private static final Logger log=LoggerFactory.getLogger(UserProfileService.class);

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getProfile(Long id) {

        log.info("fetching user profile,Userid={}",id);
        return userProfileRepository.findById(id)
        .orElseThrow(() -> {
            log.error("User Profile Not Found,UserId={}",id);
            return new UserNotFoundException("User Not Found");
        });
    }

    public Page<UserProfile> getApprovedUser(Long id,Pageable pageable) {

        log.info("fetching approved users table data by,Userid={}",id);
        String isAdmin = userProfileRepository.findUserRoleById(id).
            orElseThrow(() -> {
            log.warn("User Profile Not Found, UserId={}", id);
            return new UserNotFoundException("User Not Found");
        });
        if (!"ADMIN".equals(isAdmin))  {
            log.warn("Admin Access Required,UserId={}",id);
            throw new AdminAccessDeniedException("Admin Access Required");
        }

        return userProfileRepository.findByAccountStatusAndIdNot(
                "ACTIVE",
                id,
                pageable
        );
    }
    
}
