let isLoginMode = true;


function toggleAuthMode() {

    isLoginMode = !isLoginMode;

    const title = document.getElementById("formTitle");
    const subtitle = document.getElementById("formSubtitle");
    const registerFields = document.getElementById("registerFields");
    const authButton = document.querySelector(".auth-button");
    const switchText = document.getElementById("switchText");
    const switchButton = document.getElementById("switchButton");

    if (isLoginMode) {

        title.textContent = "Login";

        subtitle.textContent =
            "Welcome back! Login to continue.";

        registerFields.style.display = "none";

        authButton.textContent = "Login";

        switchText.textContent =
            "Don't have an account?";

        switchButton.textContent =
            "Register";

    } else {

        title.textContent = "Create Account";

        subtitle.textContent =
            "Create your BookStore account.";

        registerFields.style.display = "block";

        authButton.textContent = "Register";

        switchText.textContent =
            "Already have an account?";

        switchButton.textContent =
            "Login";
    }

    document.getElementById("message").textContent = "";
}


async function submitAuth() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        return;
    }


    try {

        let response;

        if (isLoginMode) {

            response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

        } else {

            const name =
                document.getElementById("name").value.trim();

            if (!name) {

                message.textContent =
                    "Please enter your name.";

                return;
            }


            response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });
        }


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.message || "Authentication failed.";

            return;
        }


        if (isLoginMode) {

            // Store only safe user information
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data)
            );

            message.textContent =
                "Login successful!";

            setTimeout(() => {
                window.location.href = "/";
            }, 800);

        } else {

            message.textContent =
                "Registration successful! Please login.";

            setTimeout(() => {
                toggleAuthMode();
            }, 1000);
        }


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";
    }
}