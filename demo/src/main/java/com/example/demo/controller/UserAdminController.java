package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.dto.UserRequest;
import com.example.demo.service.UserAdminService;
import com.example.demo.service.UserService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserAdminController {

    private final UserAdminService userAdminService;
    private final UserService userService;

    public UserAdminController(UserAdminService userAdminService, UserService userService) {
        this.userAdminService = userAdminService;
        this.userService = userService;
    }

    @GetMapping("/leaders")
    public List<UserDto> getLeaders() {
        return userService.getLeaders();
    }

    @GetMapping
    public Page<UserDto> getUsers(
        @RequestParam(required = false) String search,
        @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {
        return userAdminService.getUsers(search, pageable);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserRequest request) {
        return ResponseEntity.ok(userAdminService.createUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable long id, @RequestBody UserRequest request) {
        return ResponseEntity.ok(userAdminService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        userAdminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
