const API_URL = "https://sheetdb.io/api/v1/wjhlemnaekk57";
const SHEETDB_URL = "https://sheetdb.io/api/v1/1dwjpmukb3j0p"; // Ton endpoint pour POST
let etudiants = [];

// Charger les étudiants depuis SheetDB
async function chargerEtudiants() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erreur API");
        etudiants = await res.json();

        // Attacher la recherche dynamique sur tous les inputs
        document.querySelectorAll('input[id^="search-"]').forEach(input => {
            const num = input.id.split('-')[1];
            input.addEventListener('input', () => rechercher(num));
        });

    } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement de la base d’étudiants.");
    }
}

// Recherche dynamique (sans numéro étudiant)
function rechercher(num) {
    const input = document.getElementById(`search-${num}`);
    const resultsDiv = document.getElementById(`resultats-${num}`);
    resultsDiv.innerHTML = "";
    const recherche = input.value.toLowerCase();
    if (!recherche) return;

    const matches = etudiants.filter(e =>
        (`${e.Prenom} ${e.Nom}`).toLowerCase().includes(recherche)
    ).slice(0, 10);

    matches.forEach(e => {
        const div = document.createElement("div");
        div.textContent = `${e.Prenom} ${e.Nom}`;
        div.style.cursor = "pointer";
        div.onclick = () => {
            document.getElementById(`nom-${num}`).textContent = `${e.Prenom} ${e.Nom}`;
            input.value = "";
            resultsDiv.innerHTML = "";
        };
        resultsDiv.appendChild(div);
    });
}

document.getElementById('envoyer').addEventListener('click', async() => {
    const asso = document.getElementById('select-asso').value || "";
    const numero = document.getElementById('num-libre').value || "";

    // Récupérer tous les étudiants sélectionnés
    const noms = [];
    document.querySelectorAll('td[id^="nom-"]').forEach(td => {
        if (td.textContent && td.textContent !== "—") {
            noms.push(td.textContent);
        }
    });

    // Concaténer tous les noms en CSV dans une seule cellule
    const etudiantsCSV = noms.join(", ");

    // Obtenir la date et l'heure locales du navigateur séparément
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const heure = now.toLocaleTimeString('fr-FR');

    // Créer l'objet pour SheetDB
    const dataToSend = {
        Association: asso,
        Numero: numero,
        Etudiant: etudiantsCSV,
        Date: date,
        Heure: heure
    };

    console.log("Données à envoyer :", dataToSend);

    try {
        const res = await fetch(SHEETDB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [dataToSend] })
        });

        if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
        alert("✅ Données envoyées avec succès !");
    } catch (err) {
        console.error(err);
        alert("⚠️ Impossible d'envoyer les données. Vérifie l'URL et les colonnes SheetDB !");
    }
});

window.onload = chargerEtudiants;
