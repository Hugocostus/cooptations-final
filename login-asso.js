const AUTH_API = "https://script.google.com/macros/s/AKfycbwBigVj9kLbiWOeuN9W6e8SrE_Hfdg2OqgAsGqVhPUL3wr_qCdAltu8KtoeZplPMEZVig/exec";

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
        const res = await fetch(
            `${AUTH_API}?action=checkLogin&email=${encodeURIComponent(email)}&numero=${encodeURIComponent(numero)}&asso=${encodeURIComponent(asso)}`
        );

        const data = await res.json(); // ✅ JSON correct

        if (data.status === "OK") {
            // ✅ Stockage local
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userNumero", data.numero);
            localStorage.setItem("userAsso", data.asso);
            localStorage.setItem("logged", "yes");

            // Redirection vers la page association
            window.location.href = "asso.html";
        } else {
            status.textContent = "Identifiants ou association incorrects.";
        }

    } catch (err) {
        console.error(err);
        status.textContent = "Erreur serveur.";
    }
});
