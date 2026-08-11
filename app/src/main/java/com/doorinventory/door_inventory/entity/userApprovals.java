package com.doorinventory.door_inventory.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "userapprovals")
@Data
public class userapprovals {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "requestedAt")
    private LocalDateTime requestedAt=LocalDateTime.now();
    @Column(name = "reviewedAt")
    private LocalDateTime reviewedAt;    
    @Column(name = "approvalStatus", length = 20)
    private String approvalStatus="PENDING";

    @ManyToOne
    @JoinColumn(name="userId",referencedColumnName = "id")
    private users user;
}



/*CREATE TABLE userapprovals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME DEFAULT NULL,
    approvalStatus VARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY (userId) REFERENCES users(id)
); */