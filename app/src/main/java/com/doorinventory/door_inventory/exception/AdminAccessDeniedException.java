package com.doorinventory.door_inventory.exception;

public class AdminAccessDeniedException extends RuntimeException{
    
          public AdminAccessDeniedException(String msg)
          {
                super(msg);
          }
    
}
