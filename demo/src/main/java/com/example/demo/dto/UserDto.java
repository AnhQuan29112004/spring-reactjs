package com.example.demo.dto;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;

public record UserDto(
    long id,
    String username,
    Role role
) {
    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getRole());
    }
}
