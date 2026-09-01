package com.doorinventory.door_inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GradeRequest {

    @NotBlank(message = "Grade name is required")
    @Size(
        max = 25,
        message = "Grade name cannot exceed 25 characters"
    )
    private String gradeName;
}