package com.doorinventory.door_inventory.dto;
import java.time.LocalDateTime;
import lombok.Data;
@Data
public class PurchaseStockRequest {

    private Long userId;

    private String modelName;
    private String gradeName;

    private Double width;
    private Double height;

    private Integer quantity;

    private String billId;
    private String email;
    private String location;
    private String name;
    private String notes;
    private String phone;

    private LocalDateTime transactionDate;
}