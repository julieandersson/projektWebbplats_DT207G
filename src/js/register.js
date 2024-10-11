"use strict";

// Funktion för att registrera ett nytt konto
async function registerNewAccount(event) {
    event.preventDefault(); // Förhindrar att sidan laddas om

    // Hämta användarnamn och lösenord från formuläret
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Hämta token från localStorage för att kontrollera om admin är inloggad
    const token = localStorage.getItem("authToken");

    // Hämta referens till laddningsmeddelandet
    const loadingMessage = document.getElementById("loading-message");

    try {
        // Visa laddningsmeddelandet när begäran börjar
        if (loadingMessage) {
            loadingMessage.style.display = "block";
        }

        // Skicka POST-förfrågan till servern för att registrera nytt konto
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Token för autentisering
            },
            body: JSON.stringify({ username, password }) // Skicka data i JSON-format
        });

        const result = await response.json();

        // Om registreringen lyckas, omdirigera till login-sidan
        if (response.ok) {
            alert("Kontot har skapats! Omdirigerar till inloggningsidan...");
            window.location.href = "login.html"; // Omdirigera till login-sidan
        } else {
            // Visa felmeddelande om det finns ett problem med registreringen
            const errorMessageDiv = document.getElementById("error-message");
            errorMessageDiv.textContent = result.error || "Kunde inte skapa konto. Försök igen.";
        }
    } catch (error) {
        console.error("Fel vid skapandet av nytt konto:", error);
        const errorMessageDiv = document.getElementById("error-message");
        errorMessageDiv.textContent = "Ett serverfel uppstod, vänligen försök igen senare.";
    } finally {
        // Dölj laddningsmeddelandet när begäran är klar (oavsett om det lyckas eller misslyckas)
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }
    }
}

// Lägg till eventlyssnare för att hantera registreringsformuläret när sidan har laddats
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", registerNewAccount); // När formuläret skickas, anropa registerNewAccount-funktionen
    }
});
