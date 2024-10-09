/* BOKA BORD PÅ WEBBPLATSEN */

"use strict";

// Event listener för att hantera formulärinmatning när formuläret skickas
document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("booking-form");
    const bookingMessage = document.getElementById("booking-message");

    if (bookingForm) {
        bookingForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Förhindrar standardformulärets beteende

            // Hämta inmatningsvärden från formuläret
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phoneNumber = document.getElementById("phoneNumber").value;
            const numberOfGuests = document.getElementById("numberOfGuests").value;
            const bookingDate = document.getElementById("bookingDate").value;
            const specialRequests = document.getElementById("specialRequests").value;

            // Skicka POST-förfrågan till servern med bokningsdata
            try {
                const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/bookings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phoneNumber,
                        numberOfGuests,
                        bookingDate,
                        specialRequests,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    // Visa bekräftelsemeddelande om bokningen lyckas
                    bookingMessage.innerHTML = `<p class="success-message">${result.message}</p>`;
                    bookingForm.reset(); // Återställ formuläret efter lyckad bokning
                } else {
                    // Visa felmeddelande om något gick fel
                    bookingMessage.innerHTML = `<p class="error-message">${result.error || "Något gick fel, vänligen försök igen senare."}</p>`;
                }
            } catch (error) {
                console.error("Ett fel inträffade vid bokningen:", error);
                bookingMessage.innerHTML = `<p class="error-message">Ett serverfel uppstod, vänligen försök igen senare.</p>`;
            }
        });
    }
});
