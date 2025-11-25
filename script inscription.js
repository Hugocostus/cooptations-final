// === Version Supabase — Migration SheetDB → Supabase ===

// Le script HTML aura déjà créé window.supabase

async function envoyerInfos(prenom, nom, numero) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Envoi en cours...";

    // 🟢 Insertion dans la table Supabase
    const { error } = await window.supabase
        .from("cooptations_etudiant")
        .insert([
            {
                Prenom: prenom,
                Nom: nom,
                Numero: numero,
                Date: now.toLocaleDateString('fr-FR'),
                Heure: now.toLocaleTimeString('fr-FR')
            }
        ]);

    if (error) {
        console.error("Erreur Supabase :", error);
        statusMsg.textContent = "❌ Erreur lors de l'envoi.";
    } else {
        statusMsg.textContent = "✅ Informations envoyées avec succès !";
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

