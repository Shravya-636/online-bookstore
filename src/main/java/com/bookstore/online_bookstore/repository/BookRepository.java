package com.bookstore.online_bookstore.repository;

import com.bookstore.online_bookstore.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}