// === Variables globales ===

const SHEETDB_URL = "https://sheetdb.io/api/v1/wjhlemnaekk57"; // URL POST SheetDB

// Fonction pour envoyer les données à SheetDB
async function envoyerInfos(prenom, nom, numero) {
    const now = new Date();
    const data = {
        data: {
            Prenom: prenom,
            Nom: nom,
            Numero: numero,
            Date: now.toLocaleDateString('fr-FR'),
            Heure: now.toLocaleTimeString('fr-FR')
        }
    };

    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Envoi en cours...";
    try {
        const response = await fetch(SHEETDB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erreur lors de l'envoi");
        statusMsg.textContent = "✅ Informations envoyées avec succès !";
    } catch (error) {
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
