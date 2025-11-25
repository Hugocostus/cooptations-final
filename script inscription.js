// === API URLs ===
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";
const API_AUTH_URL  = "https://script.google.com/macros/s/AKfycbzyjCOYz95BM_0xxU5u7bJDzc4SdpedLu6IfDE4BrINrvLr-x_FK89kQn6BYqBbxeH2Kg/exec";


// === Fonction principale ===
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Envoi en cours...";

    // 1️⃣ Payload pour cooptations_etudiant (inscription)
    const payloadCoopt = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email,  // 🔥 important
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR")
    };

    // 2️⃣ Payload pour authentification (adresse + numéro)
    const payloadAuth = {
        action: "addAuthentification",
        Adresse: email,
        Numero: numero
    };

    try {
        // --- POST 1 : inscription ---
        await fetch(API_COOPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadCoopt)
        });

        // --- POST 2 : authentification ---
        await fetch(API_AUTH_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadAuth)
        });

        statusMsg.textContent = "✅ Inscription enregistrée & mail envoyé !";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Erreur lors de l'envoi.";
    }
}


// === Bouton d’envoi ===
document.getElementById("export-csv").addEventListener("click", (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const email = document.getElementById("email").value.trim();   // 🔥 ajouté

    if (!prenom || !nom || !numero || !email) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    envoyerInfos(prenom, nom, numero, email);
});


// === Footer année ===
document.getElementById('year').textContent = new Date().getFullYear();

