package com.example.demo.entity;

public enum Role {
    LANHDAO,     // Quản lý toàn bộ hệ thống (CRUD stores + users)
    VANTHU,    // CRUD tất cả sản phẩm trong hệ thống
    THUKHO     // Chỉ CRUD sản phẩm của chính mình
}