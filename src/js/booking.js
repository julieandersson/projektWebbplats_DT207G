/* BOKA BORD PÅ WEBBPLATSEN */

"use strict";

const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");
const bookingDateInput = document.getElementById("bookingDate");

if (bookingDateInput) {
/* Använder Flatpickr på bookingDate-fältet med inställningar för öppettider så att användaren inte kan välja en tid utanför
restaurangens öppettider */
flatpickr(bookingDateInput, {
    enableTime: true, // Aktivera tidsval
    dateFormat: "Y-m-d H:i", // Format för datum och tid
    minDate: "today", // Användare kan bara välja dagens datum eller senare
    time_24hr: true, // Använder 24-timmarformat

    onChange: function (selectedDates, dateStr, instance) {
        const dayOfWeek = selectedDates[0].getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Måndag till fredag
            instance.set('minTime', "11:00");
            instance.set('maxTime', "21:00"); // Restaurangen stänger 23, därav är 21 rimligt för sista tidsbokning
        } else { // Lördag och söndag
            instance.set('minTime', "12:00");
            instance.set('maxTime', "22:00"); // Restaurangen stänger 02, därav är 22 rimligt för sista tidsbokning, därefter drop in för endast dryck
        }
    }
  });
}

if (bookingForm) {
    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Förhindrar standardformulärets beteende

        // Töm eventuella tidigare meddelanden
        bookingMessage.textContent = '';

        // Hämta inmatningsvärden från formuläret
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const numberOfGuests = document.getElementById("numberOfGuests").value;
        const bookingDate = bookingDateInput.value;
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

// Funktion för att hämta och visa alla bokningar (endast i inloggad läge för admin)
async function fetchAndDisplayBookings() {
    // element för att visa bokningar och laddningsmeddelandet 
    const bookingContainer = document.getElementById("booking-container");
    const loadingMessage = document.getElementById("loading-message");

    // Kontrollera om bookingContainer finns på sidan innan vi kör koden
    if (!bookingContainer) {
        return; // Avbryt om vi inte är på sidan där bokningar ska visas
    }

    // Visa laddningsmeddelandet innan bokningarna laddas
    if (loadingMessage) {
        loadingMessage.style.display = "block"; // Se till att laddningsmeddelandet visas
    }

    try {
        // Hämta användarens token från localStorage (behövs för att verifiera att användaren är inloggad)
        const token = localStorage.getItem("authToken");

        // GET-förfrågan till webbtjänst för att hämta alla bokningar
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Skicka med token i förfrågan
            },
        });

        // Gör om svaret till JSON-format
        const bookings = await response.json();

        // Kolla om svaret är ok och om det finns några bokningar
        if (response.ok && bookings.length > 0) {
            // Sortera bokningarna baserat på bokningsdatumet, så att senaste bokningen hamnar högst upp på sidan
            bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
            // Skapa HTML-kod för att visa bokningarna i bookingContainer
            bookingContainer.innerHTML = bookings
                .map(
                    (booking) => `
                    <div class="booking-block">
                    <h4>${booking.name}</h4>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Telefon:</strong> ${booking.phoneNumber}</p>
                    <p><strong>Antal gäster:</strong> ${booking.numberOfGuests}</p>
                    <p><strong>Bokningsdatum:</strong> ${new Date(booking.bookingDate).toLocaleString()}</p>
                    <p><strong>Önskemål:</strong> ${booking.specialRequests || "Inga specifika önskemål"}</p>
                 </div>
                `
                )
                .join(""); // gör en enda stor sträng av alla bokningar
        } else {
            // Om inga bokningar hittades, visa meddelande
            bookingContainer.innerHTML = "<p>Inga bokningar hittades.</p>";
        }
    } catch (error) {
        // Om fel vid hämtning, skriv ut ett meddelande
        console.error("Ett fel inträffade vid hämtning av bokningar:", error);
        bookingContainer.innerHTML = "<p>Ett serverfel uppstod, vänligen försök igen senare.</p>";
    } finally {
        // Dölj laddningsmeddelandet när bokningarna har laddats eller om ett fel uppstod
        if (loadingMessage) {
            loadingMessage.style.display = "none"; // Dölj laddningsmeddelandet
        }
    }
}

// Anropa funktionen när sidan laddas för att hämta och visa bokningar
window.addEventListener("DOMContentLoaded", fetchAndDisplayBookings);



