package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;

import com.doorinventory.door_inventory.entity.InventoryEntity;
import com.doorinventory.door_inventory.entity.TransactionEntity;
import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.doorinventory.door_inventory.exception.UserNotFoundException;
import com.doorinventory.door_inventory.repository.InventoryRepository;
import com.doorinventory.door_inventory.repository.TransactionRepository;
import com.doorinventory.door_inventory.repository.ModelRepository;
import com.doorinventory.door_inventory.repository.GradeRepository;
import com.doorinventory.door_inventory.repository.DimensionRepository;
import com.doorinventory.door_inventory.repository.UserProfileRepository;
import com.doorinventory.door_inventory.dto.PurchaseStockRequest;

@Service
public class InventoryTransactionService {

    private static final Logger log=LoggerFactory.getLogger(InventoryTransactionService.class);

    private final UserProfileRepository userProfileRepository;
    private final  InventoryRepository inventoryRepository;
    private final TransactionRepository transactionRepository;
    private final ModelRepository modelRepository;
    private final GradeRepository gradeRepository;
    private final DimensionRepository dimensionRepository;

    public InventoryTransactionService(InventoryRepository inventoryRepository,TransactionRepository transactionRepository
        ,ModelRepository modelRepository,GradeRepository gradeRepository,DimensionRepository dimensionRepository,UserProfileRepository userProfileRepository)
    {
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
        this.modelRepository=modelRepository;
        this.gradeRepository=gradeRepository;
        this.dimensionRepository=dimensionRepository;
        this.userProfileRepository=userProfileRepository;
    }
    private void checkUser(Long userId) {

    if (!userProfileRepository.existsById(userId)) {
        log.warn("Purchase Stock attempted by unknown userId={}", userId);
        throw new UserNotFoundException("User not found");
    }
}
    private Long getModelId(Long userId,String modelName) {
        return modelRepository
            .findIdByModelName(modelName)
            .orElseThrow(() -> {
                log.warn(
                    "Model not found, userId={}, modelName={}",
                    userId,
                    modelName
                );
                return new RuntimeException("Model not found");
            });  
    }   

    private Long getGradeId(Long userId, String gradeName) {

        return gradeRepository
                .findIdByGradeName(gradeName)
                .orElseThrow(() -> {
                    log.warn(
                        "Grade not found, userId={}, gradeName={}",
                        userId,
                        gradeName
                    );
                    return new RuntimeException("Grade not found");
                });
    }

    private Long getDimensionId(Long userId, Double width, Double height) {

        return dimensionRepository
                .findIdByWidthAndHeight(width, height)
                .orElseThrow(() -> {
                    log.warn(
                        "Dimension not found, userId={}, width={}, height={}",
                        userId,
                        width,
                        height
                    );
                    return new RuntimeException("Dimension not found");
                });
    }

    private InventoryEntity updateInventory(
            Long modelId,
            Long gradeId,
            Long dimensionId,
            Integer quantity) {

        InventoryEntity inventory = inventoryRepository
                .findByModelIdAndGradeIdAndDimensionId(
                        modelId,
                        gradeId,
                        dimensionId
                )
                .orElseThrow(() ->{
                     log.warn("Inventory not found, modelId={}, gradeId={}, dimensionId={}",
                        modelId,
                        gradeId,
                        dimensionId
                    );
                    return new RuntimeException("Inventory not found");
                    });

        int oldStock=inventory.getStock(),newStock=oldStock+quantity;
        inventory.setStock(newStock);

        inventoryRepository.save(inventory);
        log.info(
            "Inventory stock updated, inventoryId={}, oldStock={}, addedQuantity={}, newStock={}",
            inventory.getId(),
            oldStock,
            quantity,
            newStock
        );
        return inventory;
    }

    private void saveTransaction(
        PurchaseStockRequest request,
        InventoryEntity inventory) {

        TransactionEntity transaction = new TransactionEntity();

        transaction.setInventory(inventory);
        transaction.setBillId(request.getBillId());
        transaction.setEmail(request.getEmail());
        transaction.setLocation(request.getLocation());
        transaction.setName(request.getName());
        transaction.setNotes(request.getNotes());
        transaction.setPhone(request.getPhone());
        transaction.setQuantity(request.getQuantity());

        transaction.setTransactionDate(
                request.getTransactionDate()
        );

        transaction.setType(
                TransactionTypeEnum.PURCHASE
        );
        transactionRepository.save(transaction);
        log.info(
            "Purchase transaction saved, userId={}, transactionId={}, inventoryId={}, quantity={}",
            request.getUserId(),
            transaction.getId(),
            inventory.getId(),
            request.getQuantity()
        );
    }

    @Transactional
    public void purchaseStock(PurchaseStockRequest request) {

        Long userId = request.getUserId();

        log.info(
            "Processing stock purchase, userId={}, modelName={}, gradeName={}, width={}, height={}, quantity={}",
            userId,
            request.getModelName(),
            request.getGradeName(),
            request.getWidth(),
            request.getHeight(),
            request.getQuantity()
        );

        checkUser(userId);

        Long modelId = getModelId(
                userId,
                request.getModelName()
        );
        Long gradeId = getGradeId(
                userId,
                request.getGradeName()
        );
        Long dimensionId = getDimensionId(
                userId,
                request.getWidth(),
                request.getHeight()
        );

        InventoryEntity inventory =
                updateInventory(
                        modelId,
                        gradeId,
                        dimensionId,
                        request.getQuantity()
                );
        saveTransaction(request, inventory);
    }

    
}
