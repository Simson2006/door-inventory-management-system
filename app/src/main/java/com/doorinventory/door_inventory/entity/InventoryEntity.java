package com.doorinventory.door_inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;


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
public class InventoryEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "modelId", nullable = false)
    private ModelEntity model;

    @ManyToOne
    @JoinColumn(name = "dimensionId", nullable = false)
    private DimensionEntity dimension;

    @ManyToOne
    @JoinColumn(name = "gradeId", nullable = false)
    private GradeEntity grade;

    @PositiveOrZero(message = "Stock cannot be negative")
    @Column(nullable = false, columnDefinition = "INT UNSIGNED")
    private Integer stock;
}

/* CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    modelId BIGINT NOT NULL,
    gradeId BIGINT NOT NULL,
    dimensionId BIGINT NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (modelId) REFERENCES models(id),
    FOREIGN KEY (gradeId) REFERENCES grades(id),
    FOREIGN KEY (dimensionId) REFERENCES dimensions(id)
); */