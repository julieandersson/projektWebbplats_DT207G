"use strict";

import { fetchMenu } from './menu.js'; // importerar fetchMenu funktionen i menu.js
import './booking.js'; // Importerar booking.js för att hantera bokningar
import './reviews.js'; // Importerar reviews.js för att hantera recensioner

// Väntar tills hela strukturen är laddad innan kod körs
document.addEventListener("DOMContentLoaded", () => {
    fetchMenu(); // Anropar funktionen för att hämta menyn från servern

    /* KOD FÖR HAMBURGERMENYN */

    // Hämtar knapparna för att öppna och stänga hamburgermenyn
    let openBtn = document.getElementById("open-menu");
    let closeBtn = document.getElementById("close-menu");

    // Eventlyssnare för att öppna och stänga menyn
    openBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);

    /* NAVIGERINGSKNAPPAR PÅ STARTSIDAN */

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

    /* KOD FÖR ATT SCROLLAS UPP TILL TOPPEN AV SIDAN VID KLICK AV LOGOTYP I FOOTERN */
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
    let navMenuEl = document.getElementById("nav-menu");

    // Hämtar in css för menyn
    let style = window.getComputedStyle(navMenuEl);

    // Kontrollera om nav är synlig eller ej
    if (style.display === "none") {
        navMenuEl.style.display = "block";
    } else {
        navMenuEl.style.display = "none";
    }
}
