// === API URL ===
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";


// === Main function ===
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Sending...";

    const payloadCoopt = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email,
        Date: now.toLocaleDateString("en-GB"),
        Heure: now.toLocaleTimeString("en-GB")
    };

    try {

        const response = await fetch(API_COOPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadCoopt)
        });

        const text = await response.text();

        if (text === "NUMERO_DEJA_PRIS") {
            statusMsg.textContent = "❌ Student number already used.";
            return;
        }

        if (text === "OK") {
            statusMsg.textContent = "✅ Registration recorded!";
            return;
        }

        statusMsg.textContent = "❌ Unexpected server response.";

    } catch (err) {
        console.error(err);
        statusMsg.textContent = "❌ Error during submission.";
    }
}


// === Submit button ===
document.getElementById("export-csv").addEventListener("click", (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!prenom || !nom || !numero || !email) {
        alert("Please fill in all fields.");
        return;
    }

    envoyerInfos(prenom, nom, numero, email);
});


// === Footer year ===
document.getElementById('year').textContent = new Date().getFullYear();

