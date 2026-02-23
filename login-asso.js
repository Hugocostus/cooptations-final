const AUTH_API = "https://script.google.com/macros/s/AKfycbztVvgFevCpokGkcSmMUhDPnQl2NswSEzs0K4_vFNJumUz6g-bLl0n3wwW0T9ObkpBwyA/exec";

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const asso = document.getElementById("asso").value.trim();
    const status = document.getElementById("login-status");

    if (!email || !numero || !asso) {
        status.textContent = "Please fill in all fields.";
        return;
    }

    try {
        console.log("Sending login data:", { email, numero, asso });

        const res = await fetch(
            `${AUTH_API}?action=checkLogin&email=${encodeURIComponent(email)}&numero=${encodeURIComponent(numero)}&asso=${encodeURIComponent(asso)}`
        );

        // Read raw response
        const text = await res.text();
        console.log("Raw response:", text);

        let data;
        try {
            data = JSON.parse(text);
            console.log("Parsed JSON:", data);
        } catch (err) {
            console.error("JSON parsing error:", err);
            status.textContent = "Server error (Invalid JSON).";
            return;
        }

        if (data.status === "OK") {
            // Local storage
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userNumero", data.numero);
            localStorage.setItem("userAsso", data.asso);
            localStorage.setItem("logged", "yes");

            console.log("LocalStorage updated:", {
                userEmail: data.email,
                userNumero: data.numero,
                userAsso: data.asso
            });

            // Redirection
            window.location.href = "asso.html";
        } else {
            status.textContent = "Incorrect credentials or association name.";
        }

    } catch (err) {
        console.error("Fetch error:", err);
        status.textContent = "Server error (fetch failed).";
    }
});
