package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "commands")
@Data
@NoArgsConstructor
public class Command {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(unique = true, nullable = false)
    private String so_van_ban;

    @Column
    private Date ngay_ban_hanh;

    @Column
    private Date ngay_nhan;

    @Column
    private String don_vi_gui;
    @Column
    private String loai_van_ban;


    @Column(columnDefinition = "TEXT")
    private String noi_dung;

    @Column
    private String file;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "lanh_dao_id")
    private User lanhDao;

    @Column()
    private boolean da_phe_duyet = false;
}
