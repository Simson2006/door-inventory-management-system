package com.doorinventory.door_inventory.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;

@Entity
@Table(name="dimensions")
@Data
public class dimensions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "dimensionWidth", nullable = false)
    private Double width;

    @Column(name = "dimensionHeight", nullable = false)
    private Double height;
}

/*
CREATE TABLE dimensions
(
id BIGINT PRIMARY KEY auto_increment,
dimensionWidth DECIMAL(10,2) NOT NULL ,
dimensionHeight DECIMAL(10,2) NOT NULL 
); */