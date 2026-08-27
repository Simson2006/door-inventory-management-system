package com.doorinventory.door_inventory.dto;

import java.time.LocalDate;

import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PurchaseStockRequest {

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID is Invalid")
    private Long userId;


    @NotBlank(message = "Model name is required")
    @Size(max = 25, message = "Model name cannot exceed 25 characters")
    private String modelName;


    @NotBlank(message = "Grade name is required")
    @Size(max = 25, message = "Grade name cannot exceed 25 characters")
    private String gradeName;


    @NotNull(message = "Width is required")
    @Positive(message = "Width must be greater than 0")
    private Double width;


    @NotNull(message = "Height is required")
    @Positive(message = "Height must be greater than 0")
    private Double height;


    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;


    @NotBlank(message = "Bill ID is required")
    @Size(max = 50, message = "Bill ID cannot exceed 50 characters")
    private String billId;


    @Email(message = "Invalid email address")
    @Size(max = 50, message = "Email cannot exceed 50 characters")
    private String email;


    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;


    @NotBlank(message = "Name is required")
    @Size(max = 30, message = "Name cannot exceed 30 characters")
    private String name;


    @Size(max = 400, message = "Notes cannot exceed 400 characters")
    private String notes;


   @Pattern(
        regexp = "^$|^([0-9]{10}|\\+[0-9]{12})$",
        message = "Invalid Phone Number")
    private String phone;

    public TransactionTypeEnum  transactionType;

    private LocalDate transactionDate=LocalDate.now();

    public TransactionTypeEnum getTransactionType() {
    return transactionType;
    }

    public void setTransactionType(TransactionTypeEnum transactionType) {
        this.transactionType = transactionType;
    }
}