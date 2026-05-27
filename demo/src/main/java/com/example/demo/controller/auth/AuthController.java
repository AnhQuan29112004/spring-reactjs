package com.example.demo.controller.auth;

import com.example.demo.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.example.demo.service.TokenBlacklistService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserService userService, TokenBlacklistService tokenBlacklistService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Lấy role từ user
        String role = userService.getUserRole(request.getUsername());
        
        String accessToken = jwtUtil.generateToken(request.getUsername(), role);
        String refreshToken = jwtUtil.generateRefreshToken(request.getUsername(), role);

        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request) {
        tokenBlacklistService.blacklistToken(request.getToken());
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        
        if (jwtUtil.validateToken(refreshToken) && !tokenBlacklistService.isBlacklisted(refreshToken)) {
            String type = jwtUtil.extractType(refreshToken);
            if ("refresh".equals(type)) {
                String username = jwtUtil.extractUsername(refreshToken);
                // Lấy role từ user
                String role = userService.getUserRole(username);
                String newAccessToken = jwtUtil.generateToken(username, role);
                // We can choose to return the old refresh token or generate a new one. 
                // For now, we return the old refresh token so the user can keep refreshing until it expires.
                return ResponseEntity.ok(new LoginResponse(newAccessToken, refreshToken));
            }
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody LoginRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        return ResponseEntity.ok(userService.register(user));
    }
}