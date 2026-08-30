package com.doorinventory.door_inventory.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CrudService<DataType, ID> {

    void create(ID userId, String name);

    void delete(ID userId, String name);

    void update(ID userId, String oldName, String newName);

    Page<DataType> getAll(ID userId, Pageable page);

    DataType getOne(ID userId, String name);

}