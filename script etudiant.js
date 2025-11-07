// === Variables globales ===
const API_URL = "https://sheetdb.io/api/v1/wjhlemnaekk57"; // API étudiants
const SHEETDB_URL = "https://sheetdb.io/api/v1/j7e0np995ec15"; // URL POST SheetDB pour sauvegarder
let etudiants = [];

// ✅ on garde les étudiants sélectionnés ici
let etudiantSelectionne = { 1: null, 2: null };

const associations = [
    "Astuce", "BDA", "BDE", "BDI", "BDS", "BDX", "Cheer'up", "Club voile", "Declic", "Diplo",
    "Focus", "Forum", "Gourmets", "Libr'air", "Frontrow", "PnP", "PP", "Noise", "Racing",
    "Radio", "Raid", "Ski club", "Soli", "SDC", "Transac", "Verbat'em", "JE"
];

// === Chargement des étudiants depuis l'API ===
async function chargerEtudiants() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur réseau");
        etudiants = await response.json();
        console.log("Étudiants chargés :", etudiants.length);
        initialiserListesVoeux();
    } catch (err) {
        console.error("Erreur API :", err);
        alert("Impossible de charger les étudiants.");
    }
}

// === Recherche progressive ===
function chercherEtudiants(num) {
    const recherche = document.getElementById(`search${num}`).value.toLowerCase();
    const resultDiv = document.getElementById(`resultats${num}`);
    resultDiv.innerHTML = "";
    if (recherche.trim() === "") return;

    etudiants.forEach(etudiant => {
        const texte = `${etudiant.Prenom} ${etudiant.Nom}`; // ✅ affichage sans numéro
        const texteComplet = `${etudiant.Prenom} ${etudiant.Nom} ${etudiant.Numero}`.toLowerCase();

        if (texteComplet.includes(recherche)) {
            const div = document.createElement("div");
            div.classList.add("resultat");
            div.textContent = texte;
            div.onclick = () => selectionnerEtudiant(num, etudiant);
            resultDiv.appendChild(div);
        }
    });
}

// === Sélection d'un étudiant ===
function selectionnerEtudiant(num, etudiant) {
    etudiantSelectionne[num] = etudiant; // ✅ on garde le vrai objet en mémoire

    document.getElementById(`etudiant-selectionne${num}`).textContent =
        `${etudiant.Prenom} ${etudiant.Nom}`; // ✅ affichage sans numéro

    document.getElementById(`resultats${num}`).innerHTML = "";
    document.getElementById(`search${num}`).value = "";
}

// === Initialisation des vœux ===
function initialiserListesVoeux() {
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(`voeu${i}`);
        select.innerHTML = '<option value="">-- Sélectionnez une association (facultatif) --</option>';
        associations.forEach(asso => {
            const option = document.createElement("option");
            option.value = asso;
            option.textContent = asso;
            select.appendChild(option);
        });
    }
}

// === Sauvegarde sur SheetDB ===
async function sauvegarderVoeux(etudiant1, etudiant2, voeux) {
    const now = new Date();
    const data = {
        data: {
            "Etudiant 1": etudiant1,
            "Etudiant 2": etudiant2,
            "Voeu 1": voeux[0] || "",
            "Voeu 2": voeux[1] || "",
            "Voeu 3": voeux[2] || "",
            "Voeu 4": voeux[3] || "",
            "Voeu 5": voeux[4] || "",
            "Date": now.toLocaleDateString('fr-FR'),
            "Heure": now.toLocaleTimeString('fr-FR')
        }
    };

    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Sauvegarde en cours...";
    try {
        const response = await fetch(SHEETDB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Erreur API : ${response.status}`);
        statusMsg.textContent = "✅ Vœux sauvegardés en ligne !";
    } catch (err) {
        console.error("Erreur :", err);
        statusMsg.textContent = "⚠️ Impossible de sauvegarder en ligne.";
    }
}

// === Export CSV + sauvegarde ===
document.getElementById("export-csv").addEventListener("click", () => {

    const e1 = etudiantSelectionne[1];
    const e2 = etudiantSelectionne[2];

    if (!e1 || !e2) {
        alert("⚠️ Veuillez sélectionner les deux étudiants avant d'exporter.");
        return;
    }

    // ✅ ici on remet prénom + nom + numéro pour l’export
    const etudiant1 = `${e1.Prenom} ${e1.Nom} (${e1.Numero})`;
    const etudiant2 = `${e2.Prenom} ${e2.Nom} (${e2.Numero})`;

    const voeux = [];
    for (let i = 1; i <= 5; i++) {
        voeux.push(document.getElementById(`voeu${i}`).value);
    }

    const now = new Date();
    const lignes = [
        ["Étudiant 1", "Étudiant 2", "Vœu 1", "Vœu 2", "Vœu 3", "Vœu 4", "Vœu 5", "Date", "Heure"],
        [etudiant1, etudiant2, ...voeux, now.toLocaleDateString('fr-FR'), now.toLocaleTimeString('fr-FR')]
    ];

    const csvContent = lignes.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "voeux_etudiants.csv";
    a.click();
    URL.revokeObjectURL(url);

    // ✅ sauvegarde en ligne
    sauvegarderVoeux(etudiant1, etudiant2, voeux);
});

// === Charger les étudiants au démarrage ===
window.onload = () => {
    chargerEtudiants();
    document.getElementById("search1").addEventListener("keyup", () => chercherEtudiants(1));
    document.getElementById("search2").addEventListener("keyup", () => chercherEtudiants(2));
};