package com.doorinventory.door_inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="grade")
public class Grade{
    
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 25)
    private String gradeName;
}

/* CREATE TABLE grades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gradeName VARCHAR(25) NOT NULL
); */
