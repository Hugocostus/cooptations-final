const AUTH_API = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";

document.getElementById("login-btn").addEventListener("click", async () => {
    const Adresse = document.getElementById("email").value.trim();
    const Numero = document.getElementById("numero").value.trim();
    const status = document.getElementById("login-status");

    if (!Adresse || !Numero) {
        status.textContent = "Veuillez remplir les deux champs.";
        return;
    }

    try {
        const res = await fetch(
            `${AUTH_API}?action=checkLogin&email=${encodeURIComponent(Adresse)}&numero=${encodeURIComponent(Numero)}`
        );

        const text = await res.text();

        if (text === "OK") {
            // 🔥 Stockage des données nécessaires pour la page des vœux
            localStorage.setItem("userNumero", Numero);
            localStorage.setItem("userEmail", Adresse);
            localStorage.setItem("logged", "yes");

            // Redirection
            window.location.href = "etudiant.html";
        } else {
            status.textContent = "Identifiants incorrects.";
        }

    } catch (err) {
        console.error(err);
        status.textContent = "Erreur serveur.";
    }
});

