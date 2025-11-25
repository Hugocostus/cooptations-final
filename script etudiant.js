// === Variables globales ===
const API_URL = "https://script.google.com/macros/s/AKfycbxCQMgPVc0XZy9qxTh5CB2thjFNVU3SLmbEUNJWSYzBsvTtnkTZFX08X8a3v9y06E1m4Q/exec";
let etudiants = [];

// Sélections
let etudiantSelectionne = { 1: null, 2: null };

const associations = [
    "Astuce", "BDA", "BDE", "BDI", "BDS", "BDX", "Cheer'up", "Club voile", "Declic", "Diplo",
    "Focus", "Forum", "Gourmets", "Libr'air", "Frontrow", "PnP", "PP", "Noise", "Racing",
    "Radio", "Raid", "Ski club", "Soli", "SDC", "Transac", "Verbat'em", "JE"
];

// === Charger les étudiants depuis l'API ===
async function chargerEtudiants() {
    try {
        const response = await fetch(API_URL + "?action=getStudents");
        etudiants = await response.json();
        initialiserListesVoeux();
    } catch (err) {
        console.error("Erreur chargement étudiants :", err);
        alert("Impossible de charger les étudiants.");
    }
}

// === Recherche dynamique ===
function chercherEtudiants(num) {
    const recherche = document.getElementById(`search${num}`).value.toLowerCase();
    const resultDiv = document.getElementById(`resultats${num}`);
    resultDiv.innerHTML = "";

    if (!recherche) return;

    etudiants.forEach(etudiant => {
        const txt = `${etudiant.Prenom} ${etudiant.Nom} ${etudiant.Numero}`.toLowerCase();

        if (txt.includes(recherche)) {
            const div = document.createElement("div");
            div.classList.add("resultat");
            div.textContent = `${etudiant.Prenom} ${etudiant.Nom}`;
            div.onclick = () => selectionnerEtudiant(num, etudiant);
            resultDiv.appendChild(div);
        }
    });
}

// === Sélection d'un étudiant ===
function selectionnerEtudiant(num, etudiant) {
    etudiantSelectionne[num] = etudiant;

    document.getElementById(`etudiant-selectionne${num}`).textContent =
        `${etudiant.Prenom} ${etudiant.Nom}`;

    document.getElementById(`resultats${num}`).innerHTML = "";
    document.getElementById(`search${num}`).value = "";
}

// === Initialisation des listes de vœux ===
function initialiserListesVoeux() {
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(`voeu${i}`);
        select.innerHTML = '<option value="">-- Sélectionnez une association --</option>';

        associations.forEach(asso => {
            const opt = document.createElement("option");
            opt.value = asso;
            opt.textContent = asso;
            select.appendChild(opt);
        });
    }
}

// === Sauvegarde via Apps Script ===
async function sauvegarderVoeux(etudiant1, etudiant2, voeux) {
    const now = new Date();

    const payload = {
        action: "addVoeuxEtudiant",
        Etudiant1: etudiant1,
        Etudiant2: etudiant2,
        Voeu1: voeux[0] || "",
        Voeu2: voeux[1] || "",
        Voeu3: voeux[2] || "",
        Voeu4: voeux[3] || "",
        Voeu5: voeux[4] || "",
        Date: now.toLocaleDateString('fr-FR'),
        Heure: now.toLocaleTimeString('fr-FR'),
        Email: localStorage.getItem("userEmail") // email du login
    };

    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Sauvegarde en cours...";

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        statusMsg.textContent = "✅ Vœux sauvegardés !";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Erreur lors de la sauvegarde.";
    }
}

// === Export + sauvegarde ===
document.getElementById("export-csv").addEventListener("click", () => {

    const e1 = etudiantSelectionne[1];
    const e2 = etudiantSelectionne[2];

    if (!e1 || !e2) {
        alert("Veuillez sélectionner deux fois le même étudiant.");
        return;
    }

    const etudiant1 = `${e1.Prenom} ${e1.Nom} (${e1.Numero})`;
    const etudiant2 = `${e2.Prenom} ${e2.Nom} (${e2.Numero})`;

    if (etudiant1 !== etudiant2) {
        alert("Les deux sélections doivent correspondre.");
        return;
    }

    const voeux = [];
    for (let i = 1; i <= 5; i++) {
        voeux.push(document.getElementById(`voeu${i}`).value);
    }

    sauvegarderVoeux(etudiant1, etudiant2, voeux);
});

// === Chargement ===
window.onload = () => {
    chargerEtudiants();
    document.getElementById("search1").addEventListener("keyup", () => chercherEtudiants(1));
    document.getElementById("search2").addEventListener("keyup", () => chercherEtudiants(2));
};
