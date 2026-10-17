package com.bookstore.online_bookstore.repository;

import com.bookstore.online_bookstore.entity.Order;
import com.bookstore.online_bookstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}