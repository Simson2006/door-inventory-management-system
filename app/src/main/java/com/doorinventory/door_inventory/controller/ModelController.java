package com.doorinventory.door_inventory.controller;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import com.doorinventory.door_inventory.entity.ModelEntity;
import com.doorinventory.door_inventory.service.ModelService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.Positive;

@Validated
@RestController
@RequestMapping("/inventory")
public class ModelController
{
    private final ModelService modelService;

    public ModelController(ModelService modelService)
    {
        this.modelService=modelService;
    }

    @PostMapping("users/{userId}/door-models")
    public ResponseEntity<?> createDoorModel(
        @Positive @PathVariable Long userId,
        @NotBlank @Size(max = 25) @RequestBody String modelName)
    {
        modelService.create(userId,modelName);
        return ResponseEntity.ok("Model created successfully");
    }

    @DeleteMapping("users/{userId}/door-models/{modelName}")
    public ResponseEntity<?> deleteDoorModel(
        @Positive @PathVariable Long userId,
        @NotBlank @Size(max = 25) @PathVariable String modelName)
    {
        modelService.delete(userId,modelName);
        return ResponseEntity.ok("Model removed successfully");
    }

    @GetMapping("users/{userId}/door-models")
    public ResponseEntity<?> getDoorModels(
        @Positive @PathVariable Long userId,
        @PageableDefault(page=0,size=5) Pageable page)
    {
        Page<ModelEntity> models=modelService.getAll(userId,page);
        return ResponseEntity.ok(models);
    }
    
    @GetMapping("users/{userId}/door-models/{modelName}")
    public ResponseEntity<?> getDoorModel(
        @Positive @PathVariable Long userId,
        @NotBlank @Size(max = 25) @PathVariable String modelName)
    {
        ModelEntity model=modelService.getOne(userId,modelName);
        return ResponseEntity.ok(model);
    }

    @PutMapping("users/{userId}/door-models/{oldModelName}")
    public ResponseEntity<?> updateDoorModel(
        @Positive @PathVariable Long userId,
        @NotBlank @Size(max = 25)  @PathVariable String oldModelName,
        @NotBlank @Size(max = 25) @RequestBody String newModelName)
    {
        modelService.update(userId,oldModelName,newModelName);
        return ResponseEntity.ok(String.format("%s to %s updated successfully",oldModelName,newModelName));
    }

}