"use strict";

import { fetchMenu } from './menu.js'; // importerar fetchMenu funktionen i menu.js
import './booking.js'; // Importerar booking.js för att hantera bokningar
import './reviews.js'; // Importerar reviews.js för att hantera recensioner
import './contact.js'; // Importerar contact.js för att hantera kontaktmeddelanden
import './login.js'; // Importerar login.js för att hantera inloggning

// Kör funktionen för att hämta menyn när DOM är redo
document.addEventListener("DOMContentLoaded", () => {
    fetchMenu();
});

/* KOD FÖR HAMBURGERMENYN */
// Hanterar hamburger-menyns funktionalitet
document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-menu");
    const closeBtn = document.getElementById("close-menu");

    if (openBtn && closeBtn) { // Kontrollera att knapparna existerar
        openBtn.addEventListener("click", toggleMenu);
        closeBtn.addEventListener("click", toggleMenu);
    }
});

/* NAVIGERINGSKNAPPAR PÅ STARTSIDAN */
// Hanterar navigeringsknappar på startsidan
document.addEventListener("DOMContentLoaded", () => {
    const navigateToMenuBtn = document.getElementById('navigateToMenu');
    const navigateToBookingBtn = document.getElementById('navigateToBooking');

    if (navigateToMenuBtn) {
        navigateToMenuBtn.addEventListener('click', function() {
            window.location.href = 'menu.html'; // Navigerar till menu.html
        });
    }

    if (navigateToBookingBtn) {
        navigateToBookingBtn.addEventListener('click', function() {
            window.location.href = 'booking.html'; // Navigerar till booking.html
        });
    }
});

/* KOD FÖR ATT SCROLLAS UPP TILL TOPPEN AV SIDAN VID KLICK AV LOGOTYP I FOOTERN */
document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Förhindrar standardlänk-beteendet
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Skapar en smidig scroll-effekt
            });
        });
    }
});

//Toggla fram navmeny
function toggleMenu() {
    const navMenuEl = document.getElementById("nav-menu");

    if (navMenuEl) { // Kontrollera att menyn existerar
        const style = window.getComputedStyle(navMenuEl);

        // Kontrollera om nav är synlig eller ej
        if (style.display === "none") {
            navMenuEl.style.display = "block";
        } else {
            navMenuEl.style.display = "none";
        }
    }
}

