package com.doorinventory.door_inventory.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class users{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 25,unique = true)
    private String userName;
    @Column(nullable = false, length = 255)
    private String passwordHash;  
    @Column(length = 13)
    private String mobileNumber;

    @Column(name = "dateJoined")
    private LocalDate dateJoined=LocalDate.now();
    @Column(name = "lastLogin")
    private LocalDateTime lastLogin;    
    @Column(name = "passwordLastChanged")
    private LocalDate passwordLastChanged;
    @Column(name = "accountStatus", length = 20,nullable = false)
    private String accountStatus="ACTIVE";
    @Column(length = 50, unique = true,nullable = false)
    private String email;   
    @Column(name = "userRole", length = 20,nullable = false)
    private String userRole="STAFF";
}

/* CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(25) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    mobileNumber VARCHAR(13) DEFAULT NULL,
    dateJoined DATE DEFAULT (CURRENT_DATE),
    lastLogin DATETIME DEFAULT NULL,
    passwordLastChanged DATE DEFAULT NULL,
    accountStatus VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    userRole VARCHAR(20) DEFAULT 'STAFF' NOT NULL
); */