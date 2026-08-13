package com.doorinventory.door_inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.doorinventory.door_inventory.entity.UserProfile;
import com.doorinventory.door_inventory.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;


@RestController
@RequestMapping("/api/profile")
public class UserProfileController {
    
    private final UserProfileService userProfileService;
   

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{id}")
    ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        UserProfile userProfile = userProfileService.getProfile(id);
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @GetMapping("/{id}/approveduser")
    ResponseEntity<Page<UserProfile>> getApprovedUser(@PathVariable Long id,
        @PageableDefault(page = 0,size=5)Pageable page)
    {
        Page<UserProfile> users=userProfileService.getApprovedUser(id,page);
        return new ResponseEntity<>(users,HttpStatus.OK);
    }
    
}
