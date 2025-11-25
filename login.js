const AUTH_API = "https://script.google.com/macros/s/AKfycbx-BjQwlAJMZhRdBZKPtzFJBfLbB5GiCV9fKNDQnG94YhvVHH8DcCr5t0kQwz0PcIq7tw/exec";

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
            `${AUTH_API}?action=checkLogin&Adresse=${encodeURIComponent(Adresse)}&Numero=${encodeURIComponent(Numero)}`
        );

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


  return ContentService.createTextOutput("INVALID");
}

