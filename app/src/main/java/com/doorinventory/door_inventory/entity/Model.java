package com.doorinventory.door_inventory.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Table(name="model")
@Data
public class Model{

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 25)
    private String modelName;    
}

/* CREATE TABLE models (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    modelName VARCHAR(25) NOT NULL
); */