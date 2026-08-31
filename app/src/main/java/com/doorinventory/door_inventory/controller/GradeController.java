package com.doorinventory.door_inventory.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.doorinventory.door_inventory.dto.GradeRequest;
import com.doorinventory.door_inventory.entity.GradeEntity;
import com.doorinventory.door_inventory.service.GradeService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/inventory")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }


    // CREATE
    @PostMapping("users/{userId}/door-grades")
    public ResponseEntity<?> createDoorGrade(
            @PathVariable Long userId,
            @Valid @RequestBody GradeRequest request) {

        gradeService.create(
                userId,
                request.getGradeName()
        );

        return ResponseEntity.ok(
                "Grade created successfully"
        );
    }


    // DELETE
    @DeleteMapping("users/{userId}/door-grades/{gradeName}")
    public ResponseEntity<?> deleteDoorGrade(
            @PathVariable Long userId,
            @PathVariable String gradeName) {

        gradeService.delete(
                userId,
                gradeName
        );

        return ResponseEntity.ok(
                "Grade removed successfully"
        );
    }


    // UPDATE
    @PutMapping("users/{userId}/door-grades/{oldGradeName}")
    public ResponseEntity<?> updateDoorGrade(
            @PathVariable Long userId,
            @PathVariable String oldGradeName,
            @Valid @RequestBody GradeRequest request) {

        String newGradeName = request.getGradeName();

        gradeService.update(
                userId,
                oldGradeName,
                newGradeName
        );

        return ResponseEntity.ok(
                String.format(
                        "%s to %s updated successfully",
                        oldGradeName,
                        newGradeName
                )
        );
    }


    // GET ALL
    @GetMapping("users/{userId}/door-grades")
    public ResponseEntity<?> getDoorGrades(
            @PathVariable Long userId,
            @PageableDefault(page = 0, size = 5)
            Pageable page) {

        Page<GradeEntity> grades =
                gradeService.getAll(userId, page);

        return ResponseEntity.ok(grades);
    }


    // GET ONE
    @GetMapping("users/{userId}/door-grades/{gradeName}")
    public ResponseEntity<?> getDoorGrade(
            @PathVariable Long userId,
            @PathVariable String gradeName) {

        GradeEntity grade =
                gradeService.getOne(userId, gradeName);

        return ResponseEntity.ok(grade);
    }
}