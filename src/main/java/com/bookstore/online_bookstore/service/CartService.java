package com.bookstore.online_bookstore.service;

import com.bookstore.online_bookstore.entity.Book;
import com.bookstore.online_bookstore.entity.CartItem;
import com.bookstore.online_bookstore.entity.User;
import com.bookstore.online_bookstore.repository.BookRepository;
import com.bookstore.online_bookstore.repository.CartItemRepository;
import com.bookstore.online_bookstore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       BookRepository bookRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public List<CartItem> getCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(Long userId, Long bookId, Integer quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        CartItem existingItem =
                cartItemRepository.findByUserAndBook(user, book)
                        .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(
                    existingItem.getQuantity() + quantity
            );

            return cartItemRepository.save(existingItem);
        }

        CartItem cartItem = new CartItem(user, book, quantity);

        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long userId, Long cartItemId, Integer quantity) {

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized cart access");
        }

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Long userId, Long cartItemId) {

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized cart access");
        }

        cartItemRepository.delete(cartItem);
    }
}