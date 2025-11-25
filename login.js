const AUTH_API = "https://script.google.com/macros/s/AKfycbzyjCOYz95BM_0xxU5u7bJDzc4SdpedLu6IfDE4BrINrvLr-x_FK89kQn6BYqBbxeH2Kg/exec";

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

        // 🔥 IMPORTANT : On lit en TEXTE, pas en JSON
        const text = await res.text();

        if (text === "OK") {
            localStorage.setItem("logged", "yes");
            window.location.href = "etudiant.html";
        } else {
            status.textContent = "Identifiants incorrects.";
        }

    } catch (err) {
        console.error(err);
        status.textContent = "Erreur serveur.";
    }
});
