package com.doorinventory.door_inventory.service;

import org.springframework.stereotype.Service;
import com.doorinventory.door_inventory.entity.GradeEntity;
import com.doorinventory.door_inventory.exception.ResourceAlreadyExistsException;
import com.doorinventory.door_inventory.exception.ResourceInUseException;
import com.doorinventory.door_inventory.exception.ResourceNotFoundException;
import com.doorinventory.door_inventory.repository.GradeRepository;
import com.doorinventory.door_inventory.repository.InventoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class GradeService implements CrudService<GradeEntity,Long>{

    private  final GradeRepository gradeRepository;
    private  final InventoryRepository inventoryRepository;
    private static final Logger log=LoggerFactory.getLogger(GradeService.class);

    public GradeService(GradeRepository gradeRepository,InventoryRepository inventoryRepository)
    {
        this.gradeRepository=gradeRepository;
        this.inventoryRepository=inventoryRepository;
    }

    @Override
    public void create(Long userId,String gradeName)
    {
        log.info("Creating new  grade name, userId={} name={}",userId,gradeName);
        if(gradeRepository.existsByGradeName(gradeName))
        {
        log.warn("Grade aldready exsists , userId={} name={}",userId,gradeName);
        throw new ResourceAlreadyExistsException("Grade name aldready exists");
        }

        GradeEntity grade=new GradeEntity();
        grade.setGradeName(gradeName);

        GradeEntity saveGrade=gradeRepository.save(grade);

        log.info("Grade created successfully ,userId={} gradeId={} name={}"
            ,userId,saveGrade.getId(),saveGrade.getGradeName());
    }

    @Override
    public void delete(Long userId,String gradeName)
    {
        log.info("Deleting grade, userId={} name={}",userId,gradeName);
        GradeEntity grade=gradeRepository.findByGradeName(gradeName)
                        .orElseThrow(() ->
                    {
                        log.warn("Grade not found, userId={} name={}",userId,gradeName);
                        return new ResourceNotFoundException("Grade not found");
                    });
        if(inventoryRepository.existsByGradeId(grade.getId()))
        {
            
            log.warn(
                "Cannot delete grade because stock exists, userId={} gradeId={} name={}",
                userId,
                grade.getId(),
                grade.getGradeName()
            );

            throw new ResourceInUseException("Cannot delete grade. Clear all stock first.");
        }

        gradeRepository.delete(grade);

        log.info(
            "Grade deleted successfully, userId={} gradeId={} name={}",
            userId,
            grade.getId(),
            grade.getGradeName()
        );

    }

    @Override
    public void update(Long userId,String oldName,String newName )
    {
        log.info("Updating grade name ,userId={} oldName={} newName={}",userId,oldName,newName);
        GradeEntity grade=gradeRepository.findByGradeName(oldName)
                    .orElseThrow(() -> {
                        log.warn("Grade not found, userId={} name={}",userId,oldName);
                        return new ResourceNotFoundException("Grade not found");
                    });

        //Duplicate Check
        if (!oldName.equals(newName)
        && gradeRepository.existsByGradeName(newName)) {
        log.warn(
            "New grade name already exists, userId={} name={}",
            userId,
            newName
        );
        throw new ResourceAlreadyExistsException(
            "Grade name already exists"
        );}

        grade.setGradeName(newName);
        GradeEntity savedGrade=gradeRepository.save(grade);
        log.info("Grade updated successfully, userId={} gradeId={} old={} new={}",
                userId,
                savedGrade.getId(),
                oldName,
                newName);
    }

    @Override
    public Page<GradeEntity> getAll(Long userId,Pageable page)
    {
        log.info("Getting all grade, userId={}", userId);

        return gradeRepository.findAll(page);
    }

    @Override
    public GradeEntity getOne(Long userId,String gradeName)
    {
         log.info(
            "Getting grade, userId={} name={}",
            userId,
            gradeName
        );

        return gradeRepository.findByGradeName(gradeName)
            .orElseThrow(() ->
            {
                log.warn(
                "Grade not found, userId={} name={}",
                userId,
                gradeName
            );
                return new ResourceNotFoundException("Grade not found");}
            );
    }
}