// ==============================
// 🌐 URL de ton API Apps Script
// ==============================
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";


// ==============================
// ✉️ Fonction principale : envoi
// ==============================
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Envoi en cours...";

    // Données envoyées à Apps Script
    const payload = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email,
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR")
    };

    try {
        // Envoi POST + CORS
        const response = await fetch(API_COOPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        if (text.includes("OK")) {
            statusMsg.textContent = "✅ Inscription enregistrée !";
        } else {
            statusMsg.textContent = "❌ Erreur côté serveur : " + text;
        }

    } catch (err) {
        console.error("Erreur fetch :", err);
        statusMsg.textContent = "❌ Erreur lors de l'envoi.";
    }
}


// ==============================
// 🖱️ Gestion du bouton d’envoi
// ==============================
document.getElementById("export-csv").addEventListener("click", (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const email = document.getElementById("email").value.trim();

    // Vérification des champs
    if (!prenom || !nom || !numero || !email) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    envoyerInfos(prenom, nom, numero, email);
});


// ==============================
// 🗓️ Mise à jour de l'année
// ==============================
document.getElementById("year").textContent = new Date().getFullYear();

