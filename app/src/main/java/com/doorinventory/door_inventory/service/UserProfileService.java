package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;
import com.doorinventory.door_inventory.entity.enums.AccountStatusEnum;
import com.doorinventory.door_inventory.repository.UserProfileRepository;
import com.doorinventory.door_inventory.entity.UserProfileEntity;
import com.doorinventory.door_inventory.exception.ResourceNotFoundException;
import com.doorinventory.door_inventory.exception.AdminAccessDeniedException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
@Service
public class UserProfileService{

    private final UserProfileRepository userProfileRepository;
    private static final Logger log=LoggerFactory.getLogger(UserProfileService.class);

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfileEntity getProfile(Long id) {

        log.info("fetching user profile,Userid={}",id);
        return userProfileRepository.findById(id)
        .orElseThrow(() -> {
            log.error("User Profile Not Found,UserId={}",id);
            return new ResourceNotFoundException("User not found");
        });
    }

    private void checkAdmin(Long adminId) {

        String isAdmin = userProfileRepository.findUserRoleById(adminId)
                .orElseThrow(() -> {
                    log.warn("User Profile Not Found, UserId={}",adminId);
                    return new ResourceNotFoundException("User not found");
                });

        if (!"ADMIN".equals(isAdmin)) {
            log.warn("ADMIN Access Required, UserId={}", adminId);
            throw new AdminAccessDeniedException("ADMIN Access Required");
        }
    }

    public Page<UserProfileEntity> getApprovedUser(Long adminId,Pageable pageable) {

        log.info("fetching Approved Users Table Data by,Userid={}",adminId);
        checkAdmin(adminId);
        return userProfileRepository.findByAccountStatusInAndIdNot(
                List.of(AccountStatusEnum.ACTIVE,AccountStatusEnum.SUSPENDED),
                adminId,
                pageable
        );
    }

    public Page<UserProfileEntity>  getApprovalRequestUser(Long adminId,Pageable pageable)
    {
        log.info("fetching Approval Requested Users Table Data,UserId={}",adminId);

        checkAdmin(adminId);


        return userProfileRepository.findByAccountStatusAndIdNot(AccountStatusEnum.PENDING,adminId,pageable);
    }

    public void updateUserName(Long requestId,String userName)
    {
        log.info("fetching user detail for update username,UserId={}",requestId);
        UserProfileEntity user=userProfileRepository.findById(requestId).
        orElseThrow(()->{
            log.warn("User Profile Not Found,Userid={}",requestId);
            return new ResourceNotFoundException("User Not Found");
        });
        user.setUserName(userName);
        userProfileRepository.save(user);
    }
    
    public void updateAccountStatus(Long adminId,Long targetId,String newStatus)
    {
        log.info("fetching user detail for update Account Status,adminId={},targetId={}",adminId,targetId);
        checkAdmin(adminId);
        UserProfileEntity user=userProfileRepository.findById(targetId).
        orElseThrow(()->{
            log.warn("Target User Profile Not Found,targetid={}",targetId);
            return new ResourceNotFoundException("Target User Not Found");
        });
        log.info(
        "Updating Account Status, targetId={}, Status {} to {}",
        targetId,
        user.getAccountStatus(),
        newStatus
        );
        AccountStatusEnum newAccountStatus = AccountStatusEnum.valueOf(newStatus);
        user.setAccountStatus(newAccountStatus);
        userProfileRepository.save(user);

    }

    public void updateUserRequest(Long adminId,Long targetId,String action)
    {
        log.info("fetching user detail for update User Request Pending,adminId={},targetId={}",adminId,targetId);
        checkAdmin(adminId);

        UserProfileEntity user=userProfileRepository.findById(targetId).
        orElseThrow(()->{
            log.warn("Target User Profile Not Found,targetid={}",targetId);
            return new ResourceNotFoundException("Target User Not Found");
        });

        if("ACCEPT".equals(action))
        {
        log.info("Accept User request");
        user.setAccountStatus(AccountStatusEnum.ACTIVE);
        userProfileRepository.save(user);
        }
        else if ("REJECT".equals(action))
        {
        log.info("Reject User request");
        userProfileRepository.deleteById(targetId);
        }
    }
}
