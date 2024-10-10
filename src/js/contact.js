/* SKICKA MEDDELANDE PÅ WEBBPLATSEN */

"use strict";

// Kontrollera om vi befinner oss på en sida med kontaktformuläret (contact.html)
const contactForm = document.getElementById("contact-form");

if (contactForm) { 
    // Funktion för att skicka ett meddelande via formuläret
    async function submitMessage(event) {
        event.preventDefault(); // Förhindrar standardformulärets beteende så att sidan inte laddas om

        // Hämtar värden från formuläret
        const name = document.getElementById("name").value; 
        const email = document.getElementById("email").value; 
        const message = document.getElementById("message").value;

        const errorMessageDiv = document.getElementById("error-message"); // Referens till felmeddelande
        const successMessageDiv = document.getElementById("success-message"); // Referens till bekräftelsemeddelande

        // Töm eventuella tidigare meddelanden
        errorMessageDiv.textContent = '';
        successMessageDiv.textContent = ''; 

        try {
            // Skicka meddelandet till webbtjänsten med ett POST-anrop
            const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/messages", {
                method: "POST", // POST-metod
                headers: {
                    "Content-Type": "application/json" // Skickar JSON-data
                },
                body: JSON.stringify({ name, email, message })
            });

            // Konvertera svaret till JSON-format
            const responseData = await response.json();

            // Om svaret inte är OK, kontrollera om det är ett valideringsfel
            if (!response.ok) {
                if (response.status === 400 && responseData.error) {
                    // Visa de specifika valideringsfelen från webbtjänsten om det finns några
                    errorMessageDiv.textContent = responseData.error; // Visa felmeddelandet till användaren
                } else {
                    // Om det inte är ett valideringsfel, skicka ett generellt felmeddelande
                    throw new Error("Kunde inte skicka meddelandet, vänligen försök igen.");
                }
            } else {
                // Om kontaktmeddelandet skickades/gick igenom, visa ett bekräftelsemeddelande till användaren
                successMessageDiv.textContent = "Tack för ditt meddelande! Vi återkommer så snart som möjligt.";

                // Töm formuläret efter att meddelandet har skickats
                contactForm.reset();
            }

        } catch (error) {
            // Vid fel, logga felmeddelandet till webbläsarens konsol och visa ett felmeddelande till användaren
            console.error("Fel vid skickning av meddelandet:", error);
            errorMessageDiv.textContent = "Ett fel uppstod, vänligen försök igen senare."; // Visa ett generellt felmeddelande
        }
    }

    // Lägg till eventlyssnare för formuläret som anropar funktionen `submitMessage` när formuläret skickas
    contactForm.addEventListener("submit", submitMessage);
}
