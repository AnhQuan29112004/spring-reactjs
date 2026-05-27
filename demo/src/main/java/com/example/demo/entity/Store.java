package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.example.demo.entity.User;

@Entity
@Data
@NoArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(nullable = false, unique=true)
    private String name;
    
    @Column()
    private int quantity;

    @Column()
    private double price;

    @Column()
    private String image;

    @Column()
    private long createdDate;

    @Column()
    private long updatedDate;

    // @Column()
    // private int status;

    @ManyToOne
    @JoinColumn(name = "user_id") // khóa ngoại tham chiếu đến bảng users
    private User user;
}
