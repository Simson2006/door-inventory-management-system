package com.doorinventory.door_inventory.entity;

import com.doorinventory.door_inventory.entity.enums.TransactionTypeEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(
    name = "transaction",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_transaction_bill_id",
            columnNames = "billId"
        )
    }
)
@Data
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //transaction id

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

    @Column(nullable = false, length = 50,unique = true)
    private String billId;

    @Column(length = 400)
    private String notes;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column(nullable=false)
    private Long updateBy;
}

