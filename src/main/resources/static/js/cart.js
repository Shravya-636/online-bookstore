// ===============================
// Get logged-in user
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
// Auth Section
// ===============================

function updateAuthSection() {

    const authSection =
        document.getElementById("authSection");

    const user =
        getLoggedInUser();


    if (!user) {

        authSection.innerHTML =
            `<a href="/login.html">Login</a>`;

        return;
    }


    authSection.innerHTML = `
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

    window.location.href =
        "/login.html";
}


// ===============================
// Load Cart
// ===============================

async function loadCart() {

    const user =
        getLoggedInUser();


    if (!user) {

        document.getElementById(
            "cartContainer"
        ).innerHTML = `

            <p>
                Please login to view your cart.
            </p>

            <a href="/login.html">
                Login
            </a>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/cart/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load cart"
            );
        }


        const cartItems =
            await response.json();


        displayCart(cartItems);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "cartContainer"
        ).innerHTML =
            "<p>Unable to load cart.</p>";
    }
}


// ===============================
// Display Cart
// ===============================

function displayCart(cartItems) {

    const container =
        document.getElementById(
            "cartContainer"
        );


    if (cartItems.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some books to get started.
                </p>

                <a href="/">
                    Continue Shopping
                </a>

            </div>
        `;


        document.getElementById(
            "cartSummary"
        ).style.display = "none";


        return;
    }


    let total = 0;


    let html = `

        <div class="cart-list">

    `;


    cartItems.forEach(item => {

        const itemTotal =
            item.book.price *
            item.quantity;


        total += itemTotal;


        html += `

            <div class="cart-item">

                <div class="cart-book-info">

                    <div class="book-cover">
                        📖
                    </div>

                    <div>

                        <h3>
                            ${item.book.title}
                        </h3>

                        <p>
                            by ${item.book.author}
                        </p>

                        <p>
                            ₹${item.book.price}
                        </p>

                    </div>

                </div>


                <div class="cart-quantity">

                    <button
                        onclick="
                            updateQuantity(
                                ${item.id},
                                ${item.quantity - 1}
                            )
                        ">

                        −

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="
                            updateQuantity(
                                ${item.id},
                                ${item.quantity + 1}
                            )
                        ">

                        +

                    </button>

                </div>


                <div class="cart-item-total">

                    ₹${itemTotal}

                </div>


                <button
                    class="remove-button"
                    onclick="
                        removeFromCart(${item.id})
                    ">

                    Remove

                </button>

            </div>

        `;

    });


    html += `
        </div>
    `;


    container.innerHTML = html;


    document.getElementById(
        "cartTotal"
    ).textContent = total;


    document.getElementById(
        "cartSummary"
    ).style.display = "block";
}


// ===============================
// Update Quantity
// ===============================

async function updateQuantity(
    cartItemId,
    quantity
) {

    const user =
        getLoggedInUser();


    if (quantity <= 0) {

        await removeFromCart(
            cartItemId
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/cart/${user.id}/${cartItemId}?quantity=${quantity}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to update quantity"
            );
        }


        await loadCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to update quantity."
        );
    }
}


// ===============================
// Remove Item
// ===============================

async function removeFromCart(
    cartItemId
) {

    const user =
        getLoggedInUser();


    try {

        const response =
            await fetch(
                `/api/cart/${user.id}/${cartItemId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to remove item"
            );
        }


        await loadCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to remove item."
        );
    }
}


// ===============================
// Checkout
// ===============================

async function checkout() {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "/login.html";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/orders/checkout/${user.id}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        const order =
            await response.json();


        localStorage.setItem(
         "lastOrder",
         JSON.stringify(order)
        );

        window.location.href = "/order-success.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to place order."
        );
    }
}




updateAuthSection();

loadCart();