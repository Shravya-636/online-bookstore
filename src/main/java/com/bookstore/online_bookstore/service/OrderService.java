package com.bookstore.online_bookstore.service;

import com.bookstore.online_bookstore.entity.*;
import com.bookstore.online_bookstore.repository.CartItemRepository;
import com.bookstore.online_bookstore.repository.OrderRepository;
import com.bookstore.online_bookstore.repository.UserRepository;
import com.bookstore.online_bookstore.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public Order placeOrder(Long userId) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        order.setUser(user);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        double total = 0;

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Book book = cartItem.getBook();

            // Check stock
            if (cartItem.getQuantity() > book.getStock()) {
                throw new RuntimeException(
                    "Not enough stock for: " + book.getTitle()
                );
            }

            double itemTotal = book.getPrice() * cartItem.getQuantity();

            total += itemTotal;

            OrderItem orderItem = new OrderItem(
                book,
                cartItem.getQuantity(),
                book.getPrice()
            );

            orderItems.add(orderItem);

            // Reduce stock
            book.setStock(
                book.getStock() - cartItem.getQuantity()
            );

            bookRepository.save(book);
        }

        order.setTotalAmount(total);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }   

    public List<Order> getUserOrders(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user);
    }
}
