package com.doorinventory.door_inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.doorinventory.door_inventory.entity.UserProfileEntity;
import com.doorinventory.door_inventory.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/profile")
public class UserProfileController {
    
    private final UserProfileService userProfileService;
   

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{id}")
    ResponseEntity<UserProfileEntity> getUserProfile(@PathVariable Long id) {
        UserProfileEntity userProfile = userProfileService.getProfile(id);
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @GetMapping("/{id}/approveduser")
    ResponseEntity<Page<UserProfileEntity>> getApprovedUser(@PathVariable Long id,
        @PageableDefault(page = 0,size=5)Pageable page)
    {
        Page<UserProfileEntity> users=userProfileService.getApprovedUser(id,page);
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/{id}/approvalrequestuser")
   ResponseEntity<Page<UserProfileEntity>> getApprovalRequestUser(@PathVariable Long id,
        @PageableDefault(page=0,size=5)Pageable page){

            Page<UserProfileEntity> users=userProfileService.getApprovalRequestUser(id,page);
            return new ResponseEntity<>(users,HttpStatus.OK);
    }
    
    @PostMapping("/{id}/updateusername")
    public ResponseEntity<String>updateUserName(@PathVariable long id,@RequestBody String userName) {
        userProfileService.updateUserName(id, userName);
        return new ResponseEntity<>("UserName Updated Successfully",HttpStatus.OK);
    }

    @PostMapping("/{adminId}/updateaccountstatus/{targetId}")
    public ResponseEntity<String> updateAccountStatus(@PathVariable long adminId,@PathVariable long targetId,
        @RequestBody String accountStatus) {
        
        userProfileService.updateAccountStatus(adminId,targetId,accountStatus);
        return new ResponseEntity<>("Account Status Updated Successfully",HttpStatus.OK);
    }
    
    @PostMapping("/{adminId}/updateuserrequest/{targetId}")
    public ResponseEntity<String> updateUserRequest(@PathVariable long adminId,@PathVariable long targetId,
        @RequestBody String action) { // action var going to contain accept or reject
        
        userProfileService.updateUserRequest(adminId,targetId,action);
        return new ResponseEntity<>("Action: "+action+",for User Request",HttpStatus.OK);
    }

    
}
