const AUTH_API = "https://script.google.com/macros/s/AKfycbwBigVj9kLbiWOeuN9W6e8SrE_Hfdg2OqgAsGqVhPUL3wr_qCdAltu8KtoeZplPMEZVig/exec"; // Remplace par ton URL déployée

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
            // Stockage local
            localStorage.setItem("userEmail", Adresse);
            localStorage.setItem("userNumero", Numero);
            localStorage.setItem("logged", "yes");

            // Redirection vers la page association
            window.location.href = "asso.html";
        } else {
            status.textContent = "Identifiants incorrects.";
        }

    } catch (err) {
        console.error(err);
        status.textContent = "Erreur serveur.";
    }
});
