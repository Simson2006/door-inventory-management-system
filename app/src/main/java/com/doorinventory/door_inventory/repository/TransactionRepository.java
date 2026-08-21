package com.doorinventory.door_inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.doorinventory.door_inventory.entity.TransactionEntity;



public interface TransactionRepository extends JpaRepository<TransactionEntity,Long>{

    
} 