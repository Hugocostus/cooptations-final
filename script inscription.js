// === API URL ===
const API_COOPT_URL = "https://script.google.com/macros/s/AKfycbwOzUN89SrhsRlOBoDrc7UKjJFgEh9ojMFZmc89G4EM0tcpR_aZ-VxIzaYzO7R8hpvv/exec";


// === Main function ===
async function envoyerInfos(prenom, nom, numero, email) {
    const now = new Date();
    const statusMsg = document.getElementById("status-msg");

    statusMsg.textContent = "⏳ Sending...";

    // Unique payload for cooptations_etudiant
    const payloadCoopt = {
        action: "addStudent",
        Prenom: prenom,
        Nom: nom,
        Numero: numero,
        Adresse: email, // 👈 sent to the main sheet
        Date: now.toLocaleDateString("en-GB"),
        Heure: now.toLocaleTimeString("en-GB")
    };

    try {
        // --- POST : registration ---
        await fetch(API_COOPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadCoopt)
        });

        statusMsg.textContent = "✅ Registration recorded!";

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
