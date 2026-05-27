package com.example.demo.service;

import com.example.demo.util.Util;
import com.example.demo.entity.Role;
import com.example.demo.entity.Store;
import com.example.demo.entity.User;
import com.example.demo.repository.StoreRepository;
import com.example.demo.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final Util util;

    public StoreService(StoreRepository storeRepository, UserRepository userRepository, Util util) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.util = util;
    }

    public Page<Store> getAllStores(Pageable pageable) {
        User currentUser = util.getCurrentUser();

        if (util.isLanhDao(currentUser) || util.isThuKho(currentUser)) {
            return storeRepository.findAll(pageable);
        }

        if (util.isVanThu(currentUser)) {
            List<Store> userStores = storeRepository.findByUser(currentUser);
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), userStores.size());

            if (start > userStores.size()) {
                return new org.springframework.data.domain.PageImpl<>(List.of(), pageable, userStores.size());
            }

            return new org.springframework.data.domain.PageImpl<>(
                userStores.subList(start, end),
                pageable,
                userStores.size()
            );
        }

        return Page.empty();
    }

    public Page<Store> searchStores(String name, Pageable pageable) {
        User currentUser = util.getCurrentUser();

        if (util.isLanhDao(currentUser) || util.isThuKho(currentUser)) {
            return storeRepository.findByNameContainingIgnoreCase(name, pageable);
        }

        if (util.isVanThu(currentUser)) {
            List<Store> userStores = storeRepository.findByUser(currentUser);
            List<Store> filteredStores = userStores.stream()
                .filter(store -> store.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();

            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filteredStores.size());

            if (start > filteredStores.size()) {
                return new org.springframework.data.domain.PageImpl<>(List.of(), pageable, filteredStores.size());
            }

            return new org.springframework.data.domain.PageImpl<>(
                filteredStores.subList(start, end),
                pageable,
                filteredStores.size()
            );
        }

        return Page.empty();
    }

    public Optional<Store> getStoreById(Long id) {
        User currentUser = util.getCurrentUser();
        Optional<Store> store = storeRepository.findById(id);

        if (store.isEmpty()) {
            return Optional.empty();
        }

        if (util.isLanhDao(currentUser) || util.isThuKho(currentUser)) {
            return store;
        }

        if (
            util.isVanThu(currentUser) &&
            store.get().getUser() != null &&
            store.get().getUser().getId() == currentUser.getId()
        ) {
            return store;
        }

        return Optional.empty();
    }

    public Store createStore(Store storeDetails) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (util.isVanThu(currentUser)) {
            storeDetails.setUser(currentUser);
        }

        return storeRepository.save(storeDetails);
    }

    public Store updateStore(Long id, Store storeDetails) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        return storeRepository.findById(id).map(store -> {
            if (util.isVanThu(currentUser)) {
                if (store.getUser() == null || store.getUser().getId() != currentUser.getId()) {
                    throw new RuntimeException("Access denied: You can only update your own stores");
                }
            }

            store.setName(storeDetails.getName());
            store.setQuantity(storeDetails.getQuantity());
            store.setPrice(storeDetails.getPrice());
            store.setImage(storeDetails.getImage());
            store.setUpdatedDate(storeDetails.getUpdatedDate());

            if (util.isLanhDao(currentUser) && storeDetails.getUser() != null) {
                store.setUser(storeDetails.getUser());
            }

            return storeRepository.save(store);
        }).orElseThrow(() -> new RuntimeException("Store not found"));
    }

    public void deleteStore(Long id) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        Optional<Store> store = storeRepository.findById(id);
        if (store.isEmpty()) {
            throw new RuntimeException("Store not found");
        }

        if (util.isVanThu(currentUser)) {
            if (store.get().getUser() == null || store.get().getUser().getId() != currentUser.getId()) {
                throw new RuntimeException("Access denied: You can only delete your own stores");
            }
        }

        storeRepository.deleteById(id);
    }

    public void deleteStores(List<Long> ids) {
        for (Long id : ids) {
            deleteStore(id);
        }
    }

    public User getCurrentUserInfo() {
        return util.getCurrentUser();
    }
}
