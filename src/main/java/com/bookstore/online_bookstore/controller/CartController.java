package com.bookstore.online_bookstore.controller;

import com.bookstore.online_bookstore.entity.CartItem;
import com.bookstore.online_bookstore.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}/{bookId}")
    public CartItem addToCart(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        return cartService.addToCart(userId, bookId, quantity);
    }

    @PutMapping("/{userId}/{cartItemId}")
    public CartItem updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {

        return cartService.updateQuantity(userId, cartItemId, quantity);
    }

    @DeleteMapping("/{userId}/{cartItemId}")
    public String removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {

        cartService.removeFromCart(userId, cartItemId);

        return "Item removed from cart";
    }
}