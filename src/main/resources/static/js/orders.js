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
// Load Orders
// ===============================

async function loadOrders() {

    const user =
        getLoggedInUser();


    if (!user) {

        document.getElementById(
            "ordersContainer"
        ).innerHTML = `

            <div class="empty-orders">

                <h2>
                    Please login to view your orders.
                </h2>

                <a href="/login.html">
                    Login
                </a>

            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/orders/user/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );
        }


        const orders =
            await response.json();


        displayOrders(orders);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "ordersContainer"
        ).innerHTML =
            "<p>Unable to load orders.</p>";
    }
}


// ===============================
// Display Orders
// ===============================

function displayOrders(orders) {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-orders">

                <h2>
                    No orders yet
                </h2>

                <p>
                    Your completed orders will appear here.
                </p>

                <a href="/">
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }


    let html = "";


    orders.forEach(order => {

        const orderDate =
            new Date(order.orderDate)
                .toLocaleString();


        html += `

            <div class="order-card">

                <div class="order-header">

                    <div>

                        <h2>
                            Order #${order.id}
                        </h2>

                        <p>
                            ${orderDate}
                        </p>

                    </div>


                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <div class="order-items">

        `;


        order.items.forEach(item => {

            const itemTotal =
                item.price * item.quantity;


            html += `

                <div class="order-item">

                    <div>

                        <h3>
                            ${item.book.title}
                        </h3>

                        <p>
                            by ${item.book.author}
                        </p>

                    </div>


                    <div>
                        ${item.quantity} × ₹${item.price}
                    </div>


                    <div class="item-total">
                        ₹${itemTotal}
                    </div>

                </div>

            `;
        });


        html += `

                </div>


                <div class="order-total">

                    Total:
                    ₹${order.totalAmount}

                </div>

            </div>

        `;
    });


    container.innerHTML = html;
}




updateAuthSection();

loadOrders();