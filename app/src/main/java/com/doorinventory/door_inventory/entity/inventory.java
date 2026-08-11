package com.doorinventory.door_inventory.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"modelId", "dimensionId", "gradeId"}
        )
    }
)
@Data
public class inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "modelId", nullable = false)
    private models model;

    @ManyToOne
    @JoinColumn(name = "dimensionId", nullable = false)
    private dimensions dimension;

    @ManyToOne
    @JoinColumn(name = "gradeId", nullable = false)
    private grades grade;

    @Column(nullable = false)
    private Integer stock = 0;

    private Integer lastStockChange = 0;

    private LocalDateTime updatedAt;
}

/* CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    modelId BIGINT NOT NULL,
    gradeId BIGINT NOT NULL,
    dimensionId BIGINT NOT NULL,
    stock INT NOT NULL,
    lastStockChange INT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_model_dimension_grade (modelId, dimensionId, gradeId),
    FOREIGN KEY (modelId) REFERENCES models(id),
    FOREIGN KEY (gradeId) REFERENCES grades(id),
    FOREIGN KEY (dimensionId) REFERENCES dimensions(id)
); */