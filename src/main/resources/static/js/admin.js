let editingBookId = null;


// ===============================
// Get User
// ===============================

function getLoggedInUser() {

    const user =
        localStorage.getItem("loggedInUser");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}


// ===============================
// Check Admin
// ===============================

function checkAdmin() {

    const user =
        getLoggedInUser();

    if (!user) {

        window.location.href =
            "/login.html";

        return null;
    }

    if (user.role !== "ADMIN") {

        alert(
            "Access denied. Admin privileges required."
        );

        window.location.href =
            "/";

        return null;
    }

    return user;
}


// ===============================
// Load Books
// ===============================

async function loadBooks() {

    const user =
        checkAdmin();

    if (!user) return;


    try {

        const response =
            await fetch(
                `/api/admin/books/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load books"
            );
        }


        const books =
            await response.json();


        displayBooks(books);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "adminBooks"
        ).innerHTML =
            "<p>Unable to load books.</p>";
    }
}


// ===============================
// Display Books
// ===============================

function displayBooks(books) {

    const container =
        document.getElementById(
            "adminBooks"
        );


    if (books.length === 0) {

        container.innerHTML =
            "<p>No books available.</p>";

        return;
    }


    let html = `
        <div class="admin-book-list">
    `;


    books.forEach(book => {

        html += `

            <div class="admin-book-card">

                <div>

                    <h3>
                        ${book.title}
                    </h3>

                    <p>
                        ${book.author}
                    </p>

                    <p>
                        ${book.category}
                    </p>

                    <p>
                        ₹${book.price}
                    </p>

                    <p>
                        Stock: ${book.stock}
                    </p>

                </div>


                <div>

                    <button
                        onclick="
                            editBook(
                                ${book.id},
                                '${escapeText(book.title)}',
                                '${escapeText(book.author)}',
                                '${escapeText(book.category)}',
                                ${book.price},
                                ${book.stock},
                                '${escapeText(book.description || "")}'
                            )
                        ">

                        Edit

                    </button>


                    <button
                        onclick="
                            deleteBook(${book.id})
                        ">

                        Delete

                    </button>

                </div>

            </div>
        `;
    });


    html += `
        </div>
    `;


    container.innerHTML = html;
}


// ===============================
// Escape text for onclick
// ===============================

function escapeText(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ===============================
// Save Book
// ===============================

async function saveBook() {

    const user =
        checkAdmin();

    if (!user) return;


    const book = {

        title:
            document.getElementById("title").value,

        author:
            document.getElementById("author").value,

        category:
            document.getElementById("category").value,

        price:
            Number(
                document.getElementById("price").value
            ),

        stock:
            Number(
                document.getElementById("stock").value
            ),

        description:
            document.getElementById("description").value
    };


    if (
        !book.title ||
        !book.author ||
        !book.category ||
        !book.price ||
        book.stock < 0
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    try {

        let response;


        if (editingBookId) {

            response =
                await fetch(
                    `/api/admin/books/${user.id}/${editingBookId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(book)
                    }
                );

        } else {

            response =
                await fetch(
                    `/api/admin/books/${user.id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(book)
                    }
                );
        }


        if (!response.ok) {

            throw new Error(
                "Unable to save book"
            );
        }


        alert(
            editingBookId
                ? "Book updated successfully!"
                : "Book added successfully!"
        );


        resetForm();

        loadBooks();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to save book."
        );
    }
}


// ===============================
// Edit Book
// ===============================

function editBook(
    id,
    title,
    author,
    category,
    price,
    stock,
    description
) {

    editingBookId = id;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Book";


    document.getElementById(
        "title"
    ).value = title;


    document.getElementById(
        "author"
    ).value = author;


    document.getElementById(
        "category"
    ).value = category;


    document.getElementById(
        "price"
    ).value = price;


    document.getElementById(
        "stock"
    ).value = stock;


    document.getElementById(
        "description"
    ).value = description;


    document.getElementById(
        "saveButton"
    ).textContent =
        "Update Book";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// Reset Form
// ===============================

function resetForm() {

    editingBookId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add New Book";


    document.getElementById(
        "title"
    ).value = "";


    document.getElementById(
        "author"
    ).value = "";


    document.getElementById(
        "category"
    ).value = "";


    document.getElementById(
        "price"
    ).value = "";


    document.getElementById(
        "stock"
    ).value = "";


    document.getElementById(
        "description"
    ).value = "";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Add Book";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";
}


// ===============================
// Delete Book
// ===============================

async function deleteBook(bookId) {

    const user =
        checkAdmin();

    if (!user) return;


    const confirmed =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `/api/admin/books/${user.id}/${bookId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete book"
            );
        }


        alert(
            "Book deleted successfully!"
        );


        loadBooks();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete book."
        );
    }
}


// ===============================
// Logout
// ===============================

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "/login.html";
}



checkAdmin();

loadBooks();