// === Version Google Apps Script — Migration SheetDB → GAS API ===

const API_URL = "https://script.google.com/macros/s/AKfycbygClRBG2emNVau11J94IMDLq7qHdiuHTnAdQhlhNngt4BHlM9CYkjTTwkHocZIF_Ks/exec";

async function envoyerInfos(prenom, nom, numero) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Envoi en cours...";

    // Préparation des données pour l’API Google
    const payload = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR")
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la requête");
        }

        statusMsg.textContent = "✅ Informations envoyées avec succès !";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Erreur lors de l'envoi.";
    }
}

// Gestion du bouton d'envoi
document.getElementById("export-csv").addEventListener("click", function (e) {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const numero = document.getElementById("numero").value.trim();

    if (!prenom || !nom || !numero) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    envoyerInfos(prenom, nom, numero);
});

// Affichage de l'année dans le footer
document.getElementById('year').textContent = new Date().getFullYear();

