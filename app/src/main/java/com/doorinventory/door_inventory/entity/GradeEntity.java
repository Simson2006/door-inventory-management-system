package com.doorinventory.door_inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="grade")
@Data
public class GradeEntity{
    
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 25,unique = true)
    private String gradeName;
}

/* CREATE TABLE grades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gradeName VARCHAR(25) NOT NULL UNIQUE 
); */
