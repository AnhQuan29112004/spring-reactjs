package com.example.demo.repository;

import com.example.demo.entity.Store;
import com.example.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByName(String name);
    
    List<Store> findByUser(User user);
    
    // Search by name with pagination (case-insensitive, partial match)
    Page<Store> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
