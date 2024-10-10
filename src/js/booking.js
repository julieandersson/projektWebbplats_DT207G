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

