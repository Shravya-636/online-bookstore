package com.bookstore.online_bookstore.controller;

import com.bookstore.online_bookstore.entity.Book;
import com.bookstore.online_bookstore.entity.User;
import com.bookstore.online_bookstore.repository.UserRepository;
import com.bookstore.online_bookstore.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/books")
@CrossOrigin
public class AdminBookController {

    private final BookService bookService;
    private final UserRepository userRepository;

    public AdminBookController(
            BookService bookService,
            UserRepository userRepository) {

        this.bookService = bookService;
        this.userRepository = userRepository;
    }

    private User getAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException(
                    "Access denied. Admin privileges required.");
        }

        return user;
    }

    @GetMapping("/{userId}")
    public List<Book> getBooks(@PathVariable Long userId) {

        getAdmin(userId);

        return bookService.getAllBooks();
    }

    @PostMapping("/{userId}")
    public Book addBook(
            @PathVariable Long userId,
            @RequestBody Book book) {

        getAdmin(userId);

        return bookService.addBook(book);
    }

    @PutMapping("/{userId}/{bookId}")
    public Book updateBook(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestBody Book book) {

        getAdmin(userId);

        return bookService.updateBook(bookId, book);
    }

    @DeleteMapping("/{userId}/{bookId}")
    public String deleteBook(
            @PathVariable Long userId,
            @PathVariable Long bookId) {

        getAdmin(userId);

        bookService.deleteBook(bookId);

        return "Book deleted successfully";
    }
}