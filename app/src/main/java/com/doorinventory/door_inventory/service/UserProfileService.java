package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;
import com.doorinventory.door_inventory.repository.UserProfileRepository;
import com.doorinventory.door_inventory.entity.UserProfile;
@Service
public class UserProfileService{

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getProfile(Long id) {
        return userProfileRepository.findById(id).orElseThrow(() -> new RuntimeException("User profile not found(UserProfile service file)"));
    }
}
