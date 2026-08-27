package com.doorinventory.door_inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.doorinventory.door_inventory.dto.PurchaseStockRequest;
import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;
import com.doorinventory.door_inventory.service.InventoryTransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/updateinventory")
public class InventoryTransactionController{

    private final InventoryTransactionService inventoryTransactionService;

    public InventoryTransactionController(
            InventoryTransactionService inventoryTransactionService) {

        this.inventoryTransactionService = inventoryTransactionService;
    }
    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseStock(
            @Valid @RequestBody PurchaseStockRequest request) {

        request.setTransactionType(TransactionTypeEnum.PURCHASE);
        inventoryTransactionService.updateStock(request);
        return ResponseEntity.ok("Stock purchased successfully");
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(
            @Valid @RequestBody PurchaseStockRequest request) {

        request.setTransactionType(TransactionTypeEnum.SELL);
        inventoryTransactionService.updateStock(request);
        return ResponseEntity.ok("Stock sold successfully");
    }
}