const API_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";

async function envoyerInfos(prenom, nom, numero) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Envoi en cours...";

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
            mode: "no-cors", // 🔥 FIX CORS
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Avec no-cors, on ne peut pas lire la réponse → on assume que ça marche
        statusMsg.textContent = "✅ Informations envoyées avec succès !";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Erreur lors de l'envoi.";
    }
}

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

document.getElementById('year').textContent = new Date().getFullYear();

