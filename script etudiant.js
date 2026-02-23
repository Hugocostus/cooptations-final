/* ================================
          ⚙️ GLOBAL VARIABLES
   ================================ */

const API_URL = "https://script.google.com/macros/s/AKfycbxCQMgPVc0XZy9qxTh5CB2thjFNVU3SLmbEUNJWSYzBsvTtnkTZFX08X8a3v9y06E1m4Q/exec";

let etudiantConnecte = null; // Will contain the object {Prenom, Nom, Numero}

/* List of associations */
const associations = [
    "Astuce", "BDA", "BDE", "BDI", "BDS", "BDX", "Cheer'up", "Club voile", "Declic", "Diplo",
    "Focus", "Forum", "Gourmets", "Libr'air", "Frontrow", "PnP", "PP", "Noise", "Racing",
    "Radio", "Raid", "Ski club", "Soli", "SDC", "Transac", "Verbat'em", "JE"
];


/* ================================
        🧩 LOAD LOGGED STUDENT
   ================================ */

async function chargerEtudiantConnecte() {
    const numero = localStorage.getItem("userNumero");

    console.log("🔍 LOCALSTORAGE ID =", numero);

    if (!numero) {
        alert("Error: no student number found.");
        return;
    }

    try {
        const response = await fetch(API_URL + "?action=getStudents");
        const data = await response.json();

        // Find the connected student
        etudiantConnecte = data.find(e => String(e.Numero) === String(numero));

        console.log("👤 Student found:", etudiantConnecte);

        if (!etudiantConnecte) {
            alert("Error: student not found in the database.");
            return;
        }

        // Generate full identity string
        const identite = `${etudiantConnecte.Prenom} ${etudiantConnecte.Nom} (${etudiantConnecte.Numero})`;

        // Automatically display in UI
        document.getElementById("etudiant-selectionne1").textContent = identite;
        document.getElementById("etudiant-selectionne2").textContent = identite;

    } catch (err) {
        console.error("Loading error:", err);
        alert("Unable to load student information.");
    }
}


/* ================================
         📋 WISH LISTS SETUP
   ================================ */

function initialiserListesVoeux() {
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(`voeu${i}`);
        select.innerHTML = '<option value="">-- Select an association --</option>';

        associations.forEach(asso => {
            const opt = document.createElement("option");
            opt.value = opt.textContent = asso;
            select.appendChild(opt);
        });
    }
}


/* ================================
        💾 SAVE WISHES
   ================================ */

async function sauvegarderVoeux(voeux) {
    if (!etudiantConnecte) {
        alert("Error: student data not loaded.");
        return;
    }

    const identite = `${etudiantConnecte.Prenom} ${etudiantConnecte.Nom} (${etudiantConnecte.Numero})`;

    const now = new Date();

    const email = localStorage.getItem("userEmail");
    console.log("📧 Email sent to:", email);

    const payload = {
        action: "addVoeuxEtudiant",
        Etudiant1: identite,
        Etudiant2: identite,
        Voeu1: voeux[0] || "",
        Voeu2: voeux[1] || "",
        Voeu3: voeux[2] || "",
        Voeu4: voeux[3] || "",
        Voeu5: voeux[4] || "",
        Date: now.toLocaleDateString("en-GB"),
        Heure: now.toLocaleTimeString("en-GB"),
        Email: email
    };

    console.log("📦 PAYLOAD SENT TO SERVER:", payload);

    const statusMsg = document.getElementById("status-msg");
    statusMsg.textContent = "⏳ Saving...";

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        statusMsg.textContent = "✅ Choices saved, a confirmation email has been sent.";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Error while saving.";
    }
}


/* ================================
          📤 SUBMIT BUTTON
   ================================ */

document.getElementById("export-csv").addEventListener("click", () => {

    if (!etudiantConnecte) {
        alert("Error: student not identified.");
        return;
    }

    const voeux = [];
    for (let i = 1; i <= 5; i++) {
        voeux.push(document.getElementById(`voeu${i}`).value);
    }

    sauvegarderVoeux(voeux);
});


/* ================================
          🚀 ON LOAD
   ================================ */

window.onload = () => {
    chargerEtudiantConnecte();  // Automatically fetch user info
    initialiserListesVoeux();   // Populate dropdown menus
};
