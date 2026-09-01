package com.doorinventory.door_inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ModelRequest {

    @NotBlank(message = "Model name is required")
    @Size(max = 25, message = "Model name cannot exceed 25 characters")
    private String modelName;
}