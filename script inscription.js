// === API URL ===
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";


// === Fonction principale ===
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Envoi en cours...";

    // Payload unique pour cooptations_etudiant
    const payloadCoopt = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email,  // 👈 envoyé dans la feuille principale
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR")
    };

    try {
        // --- POST : inscription ---
        await fetch(API_COOPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadCoopt)
        });

        statusMsg.textContent = "✅ Inscription enregistrée !";

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
    const email = document.getElementById("email").value.trim();

    if (!prenom || !nom || !numero || !email) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    envoyerInfos(prenom, nom, numero, email);
});


// === Footer année ===
document.getElementById('year').textContent = new Date().getFullYear();


