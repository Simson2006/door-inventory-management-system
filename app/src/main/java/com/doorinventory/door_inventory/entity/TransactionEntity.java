package com.doorinventory.door_inventory.entity;

import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
@Data
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionTypeEnum type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private InventoryEntity inventory;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String location;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 50)
    private String billId;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime transactionDate;
}

/*
CREATE TABLE transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    transaction_type ENUM('PURCHASE', 'SALE') NOT NULL,

    inventory_id BIGINT NOT NULL,

    person_name VARCHAR(150) NOT NULL,

    mobile_number VARCHAR(15) NOT NULL,

    quantity INT NOT NULL,

    bill_id VARCHAR(50) NOT NULL,

    transaction_date DATE NOT NULL,

    notes VARCHAR(500),

    CONSTRAINT fk_transaction_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventory(id)
);

*/