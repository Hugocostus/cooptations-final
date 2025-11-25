// === Variables globales ===
const API_URL = "https://script.google.com/macros/s/AKfycbw17YxKO-2sZnEy5vDrgNvFeqRNqVozi1pz5lH3WLh_bsICjWNXREhRHvI7LyxZ7BZp/exec";
let etudiants = [];

// Charger les étudiants (pour recherche dynamique)
async function chargerEtudiants() {
    try {
        const res = await fetch(API_URL + "?action=getStudents");
        if (!res.ok) throw new Error("Erreur API");

        etudiants = await res.json();

        // Attacher la recherche dynamique à chaque champ
        document.querySelectorAll('input[id^="search-"]').forEach(input => {
            const num = input.id.split("-")[1];
            input.addEventListener("input", () => rechercher(num));
        });

    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement des étudiants.");
    }
}

// Recherche dynamique
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
            document.getElementById(`nom-${num}`).textContent = `${e.Prenom} ${e.Nom}`;
            input.value = "";
            results.innerHTML = "";
        };

        results.appendChild(div);
    });
}

// Envoi des vœux asso
document.getElementById("envoyer").addEventListener("click", async () => {
    const asso = document.getElementById("select-asso").value;
    const numero = document.getElementById("num-libre").value;

    // Collecte des étudiants sélectionnés
    const noms = [];
    document.querySelectorAll('td[id^="nom-"]').forEach(td => {
        if (td.textContent && td.textContent !== "—") {
            noms.push(td.textContent);
        }
    });

    const etudiantsCSV = noms.join(", ");

    const now = new Date();
    const payload = {
        action: "addVoeuxAsso",
        Association: asso,
        Numero: numero,
        Etudiants: etudiantsCSV,
        Date: now.toLocaleDateString("fr-FR"),
        Heure: now.toLocaleTimeString("fr-FR")
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        alert("✅ Vœux association envoyés !");
    } catch (err) {
        console.error(err);
        alert("⚠️ Impossible d'envoyer les données.");
    }
});

window.onload = chargerEtudiants;

