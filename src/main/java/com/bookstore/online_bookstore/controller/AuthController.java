package com.bookstore.online_bookstore.controller;

import com.bookstore.online_bookstore.dto.UserResponse;
import com.bookstore.online_bookstore.entity.User;
import com.bookstore.online_bookstore.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody User user) {

        User savedUser = userService.register(user);

        return convertToResponse(savedUser);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody User user) {

        User loggedInUser =
                userService.login(user.getEmail(), user.getPassword());

        return convertToResponse(loggedInUser);
    }

    private UserResponse convertToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}