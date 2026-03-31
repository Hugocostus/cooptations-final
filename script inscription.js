// === API URL ===
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";

// === Main function ===
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Processing registration...";
    statusMsg.style.color = "var(--text-main)";

    const payloadCoopt = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email,
        Date: now.toLocaleDateString("en-GB"),
        Heure: now.toLocaleTimeString("en-GB")
    };

    try {
        // Suppression du mode no-cors pour permettre la lecture de la réponse
        const response = await fetch(API_COOPT_URL, {
            method: "POST",
            body: JSON.stringify(payloadCoopt)
        });

        // On récupère le texte renvoyé par le Google Apps Script
        const result = await response.text();

        if (result === "OK") {
            statusMsg.textContent = "✅ Registration recorded! Check your email.";
            statusMsg.style.color = "#4ade80"; // Vert succès
            document.getElementById("form-etudiant").reset(); // Vide le formulaire
        } else if (result === "NUMERO_DEJA_PRIS") {
            statusMsg.textContent = "❌ This Student ID is already registered.";
            statusMsg.style.color = "#f87171"; // Rouge erreur
        } else if (result === "EMAIL_DEJA_PRIS") {
            statusMsg.textContent = "❌ This Email address is already registered.";
            statusMsg.style.color = "#f87171";
        } else {
            statusMsg.textContent = "⚠️ Server message: " + result;
        }

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Connection error. Please try again later.";
        statusMsg.style.color = "#f87171";
    }
}

// === Submit button ===
document.getElementById("export-csv").addEventListener("click", (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!prenom || !nom || !numero || !email) {
        alert("Please fill in all fields.");
        return;
    }

    envoyerInfos(prenom, nom, numero, email);
});

// === Footer year ===
document.getElementById('year').textContent = new Date().getFullYear();
