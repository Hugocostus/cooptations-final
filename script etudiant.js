/* ================================
         ⚙️ VARIABLES GLOBALES
   ================================ */

const API_URL = "https://script.google.com/macros/s/AKfycbxCQMgPVc0XZy9qxTh5CB2thjFNVU3SLmbEUNJWSYzBsvTtnkTZFX08X8a3v9y06E1m4Q/exec";

let etudiantConnecte = null; // Contiendra l'objet {Prenom, Nom, Numero}

/* Liste des associations */
const associations = [
    "Astuce", "BDA", "BDE", "BDI", "BDS", "BDX", "Cheer'up", "Club voile", "Declic", "Diplo",
    "Focus", "Forum", "Gourmets", "Libr'air", "Frontrow", "PnP", "PP", "Noise", "Racing",
    "Radio", "Raid", "Ski club", "Soli", "SDC", "Transac", "Verbat'em", "JE"
];


/* ================================
       🧩 CHARGER L'ÉTUDIANT
   ================================ */

async function chargerEtudiantConnecte() {
    const numero = localStorage.getItem("userNumero");

    console.log("🔍 NUMÉRO LOCALSTORAGE =", numero);

    if (!numero) {
        alert("Erreur : aucun numéro étudiant détecté.");
        return;
    }

    try {
        const response = await fetch(API_URL + "?action=getStudents");
        const data = await response.json();

        // Chercher l'étudiant connecté
        etudiantConnecte = data.find(e => String(e.Numero) === String(numero));

        console.log("👤 ÉTUDIANT TROUVÉ :", etudiantConnecte);

        if (!etudiantConnecte) {
            alert("Erreur : étudiant introuvable dans la base.");
            return;
        }

        // Générer l'identité complète
        const identite = `${etudiantConnecte.Prenom} ${etudiantConnecte.Nom} (${etudiantConnecte.Numero})`;

        // Afficher automatiquement dans l’UI
        document.getElementById("etudiant-selectionne1").textContent = identite;
        document.getElementById("etudiant-selectionne2").textContent = identite;

    } catch (err) {
        console.error("Erreur lors du chargement :", err);
        alert("Impossible de charger les informations de l'étudiant.");
    }
}


/* ================================
        📋 LISTES DES VŒUX
   ================================ */

function initialiserListesVoeux() {
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(`voeu${i}`);
        select.innerHTML = '<option value="">-- Sélectionnez une association --</option>';

        associations.forEach(asso => {
            const opt = document.createElement("option");
            opt.value = opt.textContent = asso;
            select.appendChild(opt);
        });
    }
}


/* ================================
       💾 SAUVEGARDE DES VŒUX
   ================================ */

async function sauvegarderVoeux(voeux) {
    if (!etudiantConnecte) {
        alert("Erreur : étudiant non chargé.");
        return;
    }

    const identite = `${etudiantConnecte.Prenom} ${etudiantConnecte.Nom} (${etudiantConnecte.Numero})`;

    const now = new Date();

    const email = localStorage.getItem("userEmail");
    console.log("📧 EMAIL ENVOYÉ :", email);

    const payload = {
        action: "addVoeuxEtudiant",
        Etudiant1: identite,
        Etudiant2: identite,
        Voeu1: voeux[0] || "",
        Voeu2: voeux[1] || "",
        Voeu3: voeux[2] || "",
        Voeu4: voeux[3] || "",
        Voeu5: voeux[4] || "",
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR"),
        Email: email
    };

    console.log("📦 PAYLOAD ENVOYÉ AU SERVEUR :", payload);

    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Sauvegarde en cours...";

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        statusMsg.textContent = "✅ Vœux sauvegardés ! Un mail récapitulatif vous a été envoyé.";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Erreur lors de la sauvegarde.";
    }
}


/* ================================
          📤 BOUTON VALIDER
   ================================ */

document.getElementById("export-csv").addEventListener("click", () => {

    if (!etudiantConnecte) {
        alert("Erreur : étudiant non identifié.");
        return;
    }

    const voeux = [];
    for (let i = 1; i <= 5; i++) {
        voeux.push(document.getElementById(`voeu${i}`).value);
    }

    sauvegarderVoeux(voeux);
});


/* ================================
          🚀 AU CHARGEMENT
   ================================ */

window.onload = () => {
    chargerEtudiantConnecte();  // Récupère automatiquement l'utilisateur
    initialiserListesVoeux();   // Remplit les <select>
};



