const btn = document.getElementById("login-btn");
const status = document.getElementById("login-status");

btn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();

    if (!email || !numero) {
        status.textContent = "Veuillez remplir les deux champs.";
        return;
    }

    // Appel Apps Script via google.script.run
    google.script.run
      .withSuccessHandler(function(ok) {
          if (ok) {
              // Stockage local
              localStorage.setItem("userEmail", email);
              localStorage.setItem("userNumero", numero);
              localStorage.setItem("logged", "yes");

              // Redirection
              window.location.href = "asso.html";
          } else {
              status.textContent = "Identifiants incorrects.";
          }
      })
      .checkLogin(email, numero);
});
