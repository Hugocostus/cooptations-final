const AUTH_API = "https://script.google.com/macros/s/AKfycbztVvgFevCpokGkcSmMUhDPnQl2NswSEzs0K4_vFNJumUz6g-bLl0n3wwW0T9ObkpBwyA/exec";

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const asso = document.getElementById("asso").value.trim();
    const status = document.getElementById("login-status");

    if (!email || !numero || !asso) {
        status.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    try {
        console.log("Envoi du login :", { email, numero, asso });

        const res = await fetch(
            `${AUTH_API}?action=checkLogin&email=${encodeURIComponent(email)}&numero=${encodeURIComponent(numero)}&asso=${encodeURIComponent(asso)}`
        );

        // Lire la réponse brute
        const text = await res.text();
        console.log("Réponse brute :", text);

        let data;
        try {
            data = JSON.parse(text);
            console.log("JSON parsé :", data);
        } catch (err) {
            console.error("Erreur parsing JSON :", err);
            status.textContent = "Erreur serveur (JSON invalide).";
            return;
        }

        if (data.status === "OK") {
            // Stockage local
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userNumero", data.numero);
            localStorage.setItem("userAsso", data.asso);
            localStorage.setItem("logged", "yes");

            console.log("LocalStorage mis à jour :", {
                userEmail: data.email,
                userNumero: data.numero,
                userAsso: data.asso
            });

            // Redirection
            window.location.href = "asso.html";
        } else {
            status.textContent = "Identifiants ou association incorrects.";
        }

    } catch (err) {
        console.error("Erreur fetch :", err);
        status.textContent = "Erreur serveur (fetch).";
    }
});

