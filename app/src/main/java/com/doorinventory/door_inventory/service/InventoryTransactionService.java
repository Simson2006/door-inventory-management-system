package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;

import com.doorinventory.door_inventory.entity.DimensionEntity;
import com.doorinventory.door_inventory.entity.GradeEntity;
import com.doorinventory.door_inventory.entity.InventoryEntity;
import com.doorinventory.door_inventory.entity.ModelEntity;
import com.doorinventory.door_inventory.entity.TransactionEntity;
import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.doorinventory.door_inventory.exception.ResourceNotFoundException;
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
        throw new ResourceNotFoundException(String.format("UserId %d not found",userId));
    }
    }

    private ModelEntity getModel(Long userId,String modelName) {
        return modelRepository
            .findByModelName(modelName)
            .orElseThrow(() -> {
                log.warn(
                    "Model not found, userId={}, modelName={}",
                    userId,
                    modelName
                );
                return new ResourceNotFoundException(String.format("Model '%s' not found",modelName));
            });  
    }   

    private GradeEntity getGrade(Long userId, String gradeName) {

        return gradeRepository
                .findByGradeName(gradeName)
                .orElseThrow(() -> {
                    log.warn(
                        "Grade not found, userId={}, gradeName={}",
                        userId,
                        gradeName
                    );
                    return new ResourceNotFoundException(String.format("Grade'%s'not found",gradeName));
                });
    }

    private DimensionEntity getDimension(Long userId, Double width, Double height) {

        return dimensionRepository
                .findByDimensionWidthAndDimensionHeight(width, height)
                .orElseThrow(() -> {
                    log.warn(
                        "Dimension not found, userId={}, width={}, height={}",
                        userId,
                        width,
                        height
                    );
                    return new ResourceNotFoundException(
                    String.format("Dimension %.2f x %.2f not found",
                        width,
                        height));
                });
    }

    private InventoryEntity updateInventory(
        ModelEntity model,
        GradeEntity grade,
        DimensionEntity dimension,
        Integer quantity) {

        Long modelId=model.getId(),gradeId=grade.getId(),dimensionId=dimension.getId();
        InventoryEntity inventory = inventoryRepository
                .findByModelIdAndGradeIdAndDimensionId(
                        modelId,
                        gradeId,
                        dimensionId
                )
                .orElseGet(() -> {

                    log.info(
                        "Inventory combination not found. Creating new inventory, " +
                        "modelId={}, gradeId={}, dimensionId={}",
                        modelId,
                        gradeId,
                        dimensionId
                    );

                    InventoryEntity newInventory = new InventoryEntity();

                    newInventory.setModel(model);
                    newInventory.setGrade(grade);
                    newInventory.setDimension(dimension);
                    newInventory.setStock(quantity);

                    return newInventory;
                });

        if (inventory.getId() != null) {

            int oldStock = inventory.getStock();
            int newStock = oldStock + quantity;

            inventory.setStock(newStock);

            log.info(
                "Inventory stock updated, inventoryId={}, oldStock={}, " +
                "addedQuantity={}, newStock={}",
                inventory.getId(),
                oldStock,
                quantity,
                newStock
            );
        }
        return inventoryRepository.save(inventory);
    }
    private void saveTransaction(
        PurchaseStockRequest request,
        InventoryEntity inventory) {

        TransactionEntity transaction = new TransactionEntity();

        transaction.setUpdateBy(request.getUserId());;
        transaction.setInventory(inventory);
        transaction.setBillId(request.getBillId());
        transaction.setEmail(request.getEmail());
        transaction.setLocation(request.getLocation());
        transaction.setName(request.getName());
        if (request.getNotes() != null && request.getNotes().isBlank()) 
            request.setNotes(null);
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

        ModelEntity model = getModel(
                userId,
                request.getModelName()
        );
        GradeEntity grade = getGrade(
                userId,
                request.getGradeName()
        );
        DimensionEntity dimension = getDimension(
                userId,
                request.getWidth(),
                request.getHeight()
        );

        InventoryEntity inventory =
                updateInventory(
                        model,
                        grade,
                        dimension,
                        request.getQuantity()
                );
        saveTransaction(request, inventory);
    }

    
}
