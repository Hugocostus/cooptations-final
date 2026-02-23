// === Global Variables ===
const API_URL = "https://script.google.com/macros/s/AKfycbw17YxKO-2sZnEy5vDrgNvFeqRNqVozi1pz5lH3WLh_bsICjWNXREhRHvI7LyxZ7BZp/exec";
let etudiants = [];

// 🔥 Keep selected students here
let etudiantsSelectionnes = {};  // e.g.: { "1": {Prenom, Nom, Numero}, ... }

// Load students (for dynamic search)
async function chargerEtudiants() {
    try {
        const res = await fetch(API_URL + "?action=getStudents");
        if (!res.ok) throw new Error("API Error");

        etudiants = await res.json();

        // Attach dynamic search to each input field
        document.querySelectorAll('input[id^="search-"]').forEach(input => {
            const num = input.id.split("-")[1];
            input.addEventListener("input", () => rechercher(num));
        });

    } catch (err) {
        console.error(err);
        alert("Error while loading student list.");
    }
}

// Dynamic Search
function rechercher(num) {
    const input = document.getElementById(`search-${num}`);
    const results = document.getElementById(`resultats-${num}`);
    results.innerHTML = "";

    const q = input.value.toLowerCase();
    if (!q) return;

    const liste = etudiants
        .filter(e => (`${e.Prenom} ${e.Nom}`).toLowerCase().includes(q))
        .slice(0, 10);

    liste.forEach(e => {
        const div = document.createElement("div");
        div.textContent = `${e.Prenom} ${e.Nom}`;
        div.style.cursor = "pointer";

        div.onclick = () => {
            // Display
            document.getElementById(`nom-${num}`).textContent = `${e.Prenom} ${e.Nom}`;

            // 🔥 Full storage for submission
            etudiantsSelectionnes[num] = e;

            input.value = "";
            results.innerHTML = "";
        };

        results.appendChild(div);
    });
}

// Submit association wishes
document.getElementById("envoyer").addEventListener("click", async () => {
    const asso = document.getElementById("select-asso").value;
    const numero = document.getElementById("num-libre").value.trim();
    const email = document.getElementById("email-libre").value.trim(); 

    // Validation
    if (!asso || !numero || !email) {
        alert("Please fill in the association name, number and email.");
        return;
    }

    // Collect selected students
    const noms = [];
    document.querySelectorAll('td[id^="nom-"]').forEach(td => {
        const num = td.id.split("-")[1];
        const e = etudiantsSelectionnes[num];

        if (e) {
            noms.push(`${e.Prenom} ${e.Nom} (${e.Numero})`);
        }
    });

    const etudiantsCSV = noms.join(", ");

    const now = new Date();
    const payload = {
        action: "addVoeuxAsso",
        Association: asso,
        Numero: numero,
        Email: email, 
        Etudiants: etudiantsCSV,
        Date: now.toLocaleDateString("en-GB"),
        Heure: now.toLocaleTimeString("en-GB")
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        alert("✅ Registered successfully!");
    } catch (err) {
        console.error(err);
        alert("⚠️ Unable to submit data.");
    }
});

window.onload = chargerEtudiants;
