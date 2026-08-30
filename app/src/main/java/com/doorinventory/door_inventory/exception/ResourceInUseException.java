package com.doorinventory.door_inventory.exception;

public class ResourceInUseException extends RuntimeException
{
    public ResourceInUseException(String msg)
    {
        super(msg);
    }
}