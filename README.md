# Online Bookstore

A full-stack online bookstore application where users can browse books, manage their cart, place orders, and view their order history. Admins can manage books and inventory. Online bookstore application built using Java, Spring Boot, MySQL, HTML, CSS, and JavaScript.

## Features

- User registration and login
- Browse and search books
- Add books to cart
- Update cart quantity
- Remove items from cart
- Checkout and order placement
- Stock validation and inventory update
- Order history
- Admin dashboard
- Add, edit, and delete books
- Manage book stock

## Setup

Create the database:

```sql
CREATE DATABASE online_bookstore;
```

Configure your local database credentials in `application.properties`.

Run the application:

```bash
mvn spring-boot:run
```

Open:

```text
http://localhost:8080
```

## Demo Accounts

### Normal User

```text
Email: demouser@example.com
Password: password
```

### Admin

```text
Email: admin@bookstore.com
Password: admin
```

> Demo credentials only.

> **Note:** New users registered through the application are assigned the `USER` role by default. The `ADMIN` role cannot be assigned during registration or login. To create an admin account, register the user first and then update the role directly in the database.

## Admin Dashboard

Login using the admin account and open:

```text
http://localhost:8080/admin.html
```

Admin can add, edit, delete, and manage the stock of books.