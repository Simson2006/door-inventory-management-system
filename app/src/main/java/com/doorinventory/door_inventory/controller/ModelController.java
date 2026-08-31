package com.doorinventory.door_inventory.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.doorinventory.door_inventory.dto.ModelRequest;
import com.doorinventory.door_inventory.entity.ModelEntity;
import com.doorinventory.door_inventory.service.ModelService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;


@RestController
@RequestMapping("/inventory")
public class ModelController {

    private final ModelService modelService;

    public ModelController(ModelService modelService) {
        this.modelService = modelService;
    }


    // CREATE
    @PostMapping("users/{userId}/door-models")
    public ResponseEntity<?> createDoorModel(
            @PathVariable Long userId,
            @Valid @RequestBody ModelRequest request) {

        modelService.create(
                userId,
                request.getModelName()
        );

        return ResponseEntity.ok(
                "Model created successfully"
        );
    }


    // DELETE
    @DeleteMapping("users/{userId}/door-models/{modelName}")
    public ResponseEntity<?> deleteDoorModel(
            @PathVariable Long userId,

            @NotBlank(message = "Model name is required")
            @Size(
                max = 25,
                message = "Model name cannot exceed 25 characters"
            )
            @PathVariable String modelName) {

        modelService.delete(
                userId,
                modelName
        );

        return ResponseEntity.ok(
                "Model removed successfully"
        );
    }


    // UPDATE
    @PutMapping("users/{userId}/door-models/{oldModelName}")
    public ResponseEntity<?> updateDoorModel(
            @PathVariable Long userId,

            @NotBlank(message = "Old model name is required")
            @Size(
                max = 25,
                message = "Old model name cannot exceed 25 characters"
            )
            @PathVariable String oldModelName,

            @Valid @RequestBody ModelRequest request) {

        String newModelName = request.getModelName();

        modelService.update(
                userId,
                oldModelName,
                newModelName
        );

        return ResponseEntity.ok(
                String.format(
                        "%s to %s updated successfully",
                        oldModelName,
                        newModelName
                )
        );
    }


    // GET ALL
    @GetMapping("users/{userId}/door-models")
    public ResponseEntity<?> getDoorModels(
            @Positive(message = "User ID must be positive")
            @PathVariable Long userId,

            @PageableDefault(page = 0, size = 5)
            Pageable page) {

        Page<ModelEntity> models =
                modelService.getAll(userId, page);

        return ResponseEntity.ok(models);
    }


    // GET ONE
    @GetMapping("users/{userId}/door-models/{modelName}")
    public ResponseEntity<?> getDoorModel(
            @Positive(message = "User ID must be positive")
            @PathVariable Long userId,

            @NotBlank(message = "Model name is required")
            @Size(
                max = 25,
                message = "Model name cannot exceed 25 characters"
            )
            @PathVariable String modelName) {

        ModelEntity model =
                modelService.getOne(userId, modelName);

        return ResponseEntity.ok(model);
    }
}