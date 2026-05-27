package com.example.demo.util;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class Util {

    private final UserRepository userRepository;

    public Util(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElse(null);
    }

    public boolean isLanhDao(User user) {
        return user != null && user.getRole() == Role.LANHDAO;
    }

    public boolean isThuKho(User user) {
        return user != null && user.getRole() == Role.THUKHO;
    }

    public boolean isVanThu(User user) {
        return user != null && user.getRole() == Role.VANTHU;
    }
}