package com.example.demo.config;

import com.example.demo.util.JwtUtil;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TokenBlacklistService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  
  private final JwtUtil jwtUtil;
  private final TokenBlacklistService tokenBlacklistService;
  private final UserRepository userRepository;

  public SecurityConfig(JwtUtil jwtUtil, TokenBlacklistService tokenBlacklistService,UserRepository userRepository) {
      this.jwtUtil = jwtUtil;
      this.tokenBlacklistService = tokenBlacklistService;
      this.userRepository = userRepository;
  }

  @Bean
  public JwtFilter jwtFilter() {
      return new JwtFilter(jwtUtil, tokenBlacklistService);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
      return config.getAuthenticationManager();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(List.of("http://localhost:5173"));
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      config.setAllowedHeaders(List.of("*"));
      config.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);
      return source;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/uploads/**").permitAll()
            .requestMatchers("/api/leaders").authenticated()
            .requestMatchers("/api/users/**").hasRole("LANHDAO")
            .requestMatchers("/api/uploads/**").authenticated()
            .requestMatchers("/api/stores/**").authenticated()
            .requestMatchers("/api/commands/**").authenticated()
            .anyRequest().authenticated())
        .csrf(AbstractHttpConfigurer::disable)
        .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
      return http.build();
  }
//   @Bean
//     public UserDetailsService userDetailsService() {
//         return username -> {
//             User user = userRepository.findByUsername(username)
//                     .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
//             return new org.springframework.security.core.userdetails.User(
//                 user.getUsername(),
//                 user.getPassword(),
//                 Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
//             );
//         };
//     }
}
