package com.bookstore.online_bookstore.repository;

import com.bookstore.online_bookstore.entity.CartItem;
import com.bookstore.online_bookstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndBook(User user, com.bookstore.online_bookstore.entity.Book book);
}