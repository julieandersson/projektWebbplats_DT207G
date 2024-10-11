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

// Funktion för att hämta och visa alla meddelanden (endast i inloggad läge för admin)
async function fetchAndDisplayMessages() {
    // element för att visa meddelanden och laddningsmeddelandet
    const messagesContainer = document.getElementById("messages-container");
    const loadingMessage = document.getElementById("loading-message");

    // Kontrollera om messagesContainer finns på sidan innan vi kör koden
    if (!messagesContainer) {
        return; // Avbryt om vi inte är på sidan där meddelanden ska visas
    }

    // Visa laddningsmeddelandet innan meddelandena laddas
    if (loadingMessage) {
        loadingMessage.style.display = "block"; // Se till att laddningsmeddelandet visas
    }

    try {
        // Hämta användarens token från localStorage (behövs för att verifiera att användaren är inloggad)
        const token = localStorage.getItem("authToken");

        // GET-förfrågan till webbtjänst för att hämta alla meddelanden
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/messages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Skicka med token i förfrågan
            },
        });

        // Gör om svaret till JSON-format
        const messages = await response.json();

        // Kolla om svaret är ok och om det finns några meddelanden
        if (response.ok && messages.length > 0) {
            // Skapa HTML-kod för att visa meddelandena i messagesContainer
            messagesContainer.innerHTML = messages
                .map(
                    (message) => `
                    <div class="message-item">
                        <p><strong>Namn:</strong> ${message.name}</p>
                        <p><strong>Email:</strong> ${message.email}</p>
                        <p><strong>Meddelande:</strong> ${message.message}</p>
                        <p><strong>Svar:</strong> ${message.response || "Inget svar ännu"}</p>
                        <p><strong>Skickat:</strong> ${new Date(message.dateSent).toLocaleString()}</p>
                        <textarea id="response-${message._id}" placeholder="Skriv ditt svar här. Användaren kommer få svaret skickat till sig på den avgivna email-adressen."></textarea>
                        <button onclick="sendResponse('${message._id}')">Skicka svar</button>
                    </div>
                    <hr>
                `
                )
                .join(""); // gör en enda stor sträng av alla meddelanden
        } else {
            // Om inga meddelanden hittades, visa meddelande
            messagesContainer.innerHTML = "<p>Inga meddelanden hittades.</p>";
        }
    } catch (error) {
        // Om fel vid hämtning, skriv ut ett meddelande
        console.error("Ett fel inträffade vid hämtning av meddelanden:", error);
        messagesContainer.innerHTML = "<p>Ett serverfel uppstod, vänligen försök igen senare.</p>";
    } finally {
        // Dölj laddningsmeddelandet när meddelandena har laddats eller om ett fel uppstod
        if (loadingMessage) {
            loadingMessage.style.display = "none"; // Dölj laddningsmeddelandet
        }
    }
}

// Funktion för att skicka ett svar på ett meddelande
export async function sendResponse(messageId) {
    const responseText = document.getElementById(`response-${messageId}`).value; // Hämta svaret från textområdet

    // Kontrollera att svaret inte är tomt
    if (!responseText) {
        alert("Vänligen skriv ett svar innan du skickar.");
        return;
    }

    try {
        const token = localStorage.getItem("authToken"); // Hämta token från localStorage

        // Skicka PUT-förfrågan till servern för att uppdatera meddelandet med svaret
        const response = await fetch(`https://projektwebservice-dt207g.onrender.com/api/messages/${messageId}/response`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Skicka med token i förfrågan
            },
            body: JSON.stringify({ response: responseText }) // Skicka svaret i förfrågan
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Visa ett meddelande om att svaret har skickats
            fetchAndDisplayMessages(); // Uppdatera meddelandelistan så att svaret visas
        } else {
            alert(result.error || "Kunde inte skicka svar. Försök igen.");
        }
    } catch (error) {
        console.error("Ett fel inträffade vid svarandet på meddelandet:", error);
        alert("Ett serverfel uppstod, vänligen försök igen senare.");
    }
}


// Anropa funktionen när sidan laddas för att hämta och visa meddelanden
window.addEventListener("DOMContentLoaded", fetchAndDisplayMessages);
