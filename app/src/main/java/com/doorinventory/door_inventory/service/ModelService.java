package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.doorinventory.door_inventory.exception.ResourceAlreadyExistsException;
import com.doorinventory.door_inventory.exception.ResourceInUseException;
import com.doorinventory.door_inventory.exception.ResourceNotFoundException;
import com.doorinventory.door_inventory.repository.InventoryRepository;
import com.doorinventory.door_inventory.repository.ModelRepository;
import com.doorinventory.door_inventory.entity.ModelEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ModelService implements CrudService<ModelEntity, Long> {

    private final ModelRepository modelRepository;
    private final InventoryRepository inventoryRepository;
    private static final Logger log=LoggerFactory.getLogger(ModelService.class);

    public ModelService(ModelRepository modelRepository,InventoryRepository inventoryRepository)
    {
        this.modelRepository=modelRepository;
        this.inventoryRepository=inventoryRepository;
    }


    
    @Override
    public void create(Long userId, String name) {
        // create model
        log.info("Creating new model, userId={} name={}",userId,name);

        if(modelRepository.existsByModelName(name)) 
        {
            log.warn("Model aldready exsists , userId={} name={}",userId,name);
            throw new ResourceAlreadyExistsException("Model name aldready exists");
        }
      
        ModelEntity newModel=new ModelEntity();
        newModel.setModelName(name);
        ModelEntity savedModel = modelRepository.save(newModel);

        log.info(
            "Model created successfully, userId={} modelId={} name={}",
            userId,
            savedModel.getId(),
            savedModel.getModelName()
        );
    }

    @Override
    public void delete(Long userId, String name) {

        log.info(
            "Deleting model, userId={} name={}",
            userId,
            name
        );

        ModelEntity model = modelRepository.findByModelName(name)
            .orElseThrow(() -> {
                log.warn(
                    "Model not found, userId={} name={}",
                    userId,
                    name
                );

                return new ResourceNotFoundException("Model not found");
            });

        if (inventoryRepository.existsByModelId(model.getId())) {

            log.warn(
                "Cannot delete model because stock exists, userId={} modelId={} name={}",
                userId,
                model.getId(),
                model.getModelName()
            );

            throw new ResourceInUseException(
                "Cannot delete model. Clear all stock first."
            );
        }


        modelRepository.delete(model);

        log.info(
            "Model deleted successfully, userId={} modelId={} name={}",
            userId,
            model.getId(),
            model.getModelName()
        );
    }

    @Override
    public void update(Long userId, String oldName, String newName) {
        // update model
        log.info("Updating model name ,userId={} old={} new={}",userId,oldName,newName);
        ModelEntity model=modelRepository.findByModelName(oldName)
                        .orElseThrow(() -> {
                            
                            log.warn("Model not found,userId={} name={}",
                                userId,
                                oldName
                            );
                            
                            return new ResourceNotFoundException("Model not found");
                        });
        //Duplicate Check
        if (!oldName.equals(newName)
        && modelRepository.existsByModelName(newName)) {
        log.warn(
            "New model name already exists, userId={} name={}",
            userId,
            newName
        );
        throw new ResourceAlreadyExistsException(
            "Model name already exists"
        );}

        model.setModelName(newName);
        ModelEntity savedModel=modelRepository.save(model);
        log.info("Model updated successfully, userId={} modelId={} old={} new={}",
                userId,
                savedModel.getId(),
                oldName,
                newName);

    }

    @Override
    public Page<ModelEntity> getAll(Long userId, Pageable page) {

        log.info("Getting all models, userId={}", userId);

        return modelRepository.findAll(page);
    }

    @Override
    public ModelEntity getOne(Long userId, String name) {

        log.info(
            "Getting model, userId={} name={}",
            userId,
            name
        );

        return modelRepository.findByModelName(name)
            .orElseThrow(() ->
            {
                log.warn(
                "Model not found, userId={} name={}",
                userId,
                name
            );
                return new ResourceNotFoundException("Model not found");}
            );
    }
}