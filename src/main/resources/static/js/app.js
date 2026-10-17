let books = [];


// ===============================
// Get logged-in user
// ===============================

function getLoggedInUser() {

    const user = localStorage.getItem("loggedInUser");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}


// ===============================
// Display Login / User / Logout
// ===============================

function updateAuthSection() {

    const authSection =
        document.getElementById("authSection");

    const user = getLoggedInUser();

    if (!user) {

        authSection.innerHTML = `
            <a href="/login.html">Login</a>
        `;

        return;
    }

    let adminLink = "";

    if (user.role === "ADMIN") {

        adminLink = `
            <a href="/admin.html">
                Admin
            </a>
        `;
    }

    authSection.innerHTML = `
        ${adminLink}

        <span class="welcome-user">
            Hi, ${user.name}
        </span>

        <button
            class="logout-button"
            onclick="logout()">
            Logout
        </button>
    `;
}


// ===============================
// Logout
// ===============================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "/login.html";
}


// ===============================
// Load Books
// ===============================

async function loadBooks() {

    try {

        const response =
            await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        books = await response.json();

        displayBooks(books);

        loadCartCount();

    } catch (error) {

        console.error(error);

        document.getElementById("bookContainer").innerHTML =
            "<p>Unable to load books.</p>";
    }
}


// ===============================
// Display Books
// ===============================

function displayBooks(bookList) {

    const container =
        document.getElementById("bookContainer");

    container.innerHTML = "";

    if (bookList.length === 0) {

        container.innerHTML =
            "<p>No books found.</p>";

        return;
    }


    bookList.forEach(book => {

        const card =
            document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `
            <div class="book-cover">
                📖
            </div>

            <h3>${book.title}</h3>

            <p class="author">
                by ${book.author}
            </p>

            <p class="category">
                ${book.category}
            </p>

            <p class="price">
                ₹${book.price}
            </p>

            <button
                class="add-cart"
                onclick="addToCart(${book.id})">

                Add to Cart

            </button>
        `;

        container.appendChild(card);
    });
}


// ===============================
// Add To Backend Cart
// ===============================

async function addToCart(bookId) {

    const user = getLoggedInUser();

    if (!user) {

        alert("Please login to add books to your cart.");

        window.location.href = "/login.html";

        return;
    }


    try {

        const response = await fetch(
            `/api/cart/${user.id}/${bookId}?quantity=1`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to add book to cart"
            );
        }


        const cartItem =
            await response.json();


        alert(
            `${cartItem.book.title} added to cart!`
        );


        loadCartCount();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to add book to cart."
        );
    }
}


// ===============================
// Load Cart Count
// ===============================

async function loadCartCount() {

    const user = getLoggedInUser();

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) return;


    if (!user) {

        cartCount.textContent = "0";

        return;
    }


    try {

        const response =
            await fetch(`/api/cart/${user.id}`);

        if (!response.ok) {
            throw new Error("Failed to load cart");
        }

        const cartItems =
            await response.json();


        let totalQuantity = 0;

        cartItems.forEach(item => {

            totalQuantity += item.quantity;

        });


        cartCount.textContent =
            totalQuantity;

    } catch (error) {

        console.error(error);

        cartCount.textContent = "0";
    }
}


// ===============================
// Search
// ===============================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const searchTerm =
            this.value.toLowerCase();


        const filteredBooks =
            books.filter(book =>

                book.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                book.category
                    .toLowerCase()
                    .includes(searchTerm)
            );


        displayBooks(filteredBooks);

    });




updateAuthSection();

loadBooks();