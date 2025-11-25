const AUTH_API = "https://script.google.com/macros/s/AKfycbzyjCOYz95BM_0xxU5u7bJDzc4SdpedLu6IfDE4BrINrvLr-x_FK89kQn6BYqBbxeH2Kg/exec";

document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const status = document.getElementById("login-status");

    if (!email || !numero) {
        status.textContent = "Veuillez remplir les deux champs.";
        return;
    }

    try {
        const res = await fetch(
            `${AUTH_API}?action=checkLogin&email=${encodeURIComponent(Adresse)}&numero=${encodeURIComponent(Numero)}`
        );

        const text = await res.text();

        if (text === "OK") {
            localStorage.setItem("logged", "yes");
            window.location.href = "etudiant.html"; // 🔥 accès autorisé
        } else {
            status.textContent = "Identifiants incorrects.";
        }

    } catch (err) {
        console.error(err);
        status.textContent = "Erreur serveur.";
    }
});
