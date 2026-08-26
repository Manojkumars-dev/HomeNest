package com.homenest.service;

import com.homenest.dto.AuthResponse;
import com.homenest.dto.LoginRequest;
import com.homenest.dto.RegisterRequest;
import com.homenest.model.User;
import com.homenest.repository.UserRepository;
import com.homenest.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // Manual constructor injection (replacing @RequiredArgsConstructor)
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * REGISTER — Create new user account
     * 1. Check email not already used
     * 2. Hash the password with BCrypt (NEVER store plain text)
     * 3. Save user to MySQL database
     * 4. Generate JWT token
     * 5. Return token + user details to frontend
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please login instead.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : User.Role.TENANT)
                .active(true)
                .verified(false)
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(token, user);
    }

    /**
     * LOGIN — Authenticate existing user
     * 1. Spring Security verifies email + hashed password
     * 2. If valid → generate JWT token
     * 3. Return token + user details
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .build();
        return AuthResponse.builder().token(token).user(userDto).build();
    }
}
