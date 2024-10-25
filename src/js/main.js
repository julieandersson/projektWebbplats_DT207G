"use strict";

// döljer innehållet på sidan så att ingen skyddad information visas innan användarens status kontrolleras
document.body.style.visibility = 'hidden';

// hämtar användarens token från localStorage för att se om användaren är inloggad
const token = localStorage.getItem('authToken');

// listar de sidor som bara ska vara tillgängliga för inloggade admin-användare
const protectedPages = ['loggedin.html', 'adminmenu.html', 'messages.html', 'register.html'];

// kontrollerar vilken sida användaren är på genom att hämta sidans filnamn från URL:en
const currentPage = window.location.pathname.split('/').pop(); // Exempel: "loggedin.html"

// kollar om den nuvarande sidan är en skyddad admin-sida
const isProtectedPage = protectedPages.includes(currentPage);

// Om användaren försöker nå en skyddad sida och inte är inloggad (dvs. token saknas) så omdirigera till login-sidan
if (!token && isProtectedPage) {
    window.location.href = 'login.html';
} else {
    // Om användaren är inloggad eller om sidan inte är skyddad, visa innehållet
    document.body.style.visibility = 'visible';
}

import { fetchMenu } from './menu.js'; // importerar fetchMenu funktionen i menu.js
// Kör funktionen för att hämta menyn när DOM är redo
document.addEventListener("DOMContentLoaded", () => {
    fetchMenu();
});

import './booking.js'; // Importerar booking.js för att hantera bokningar
import './reviews.js'; // Importerar reviews.js för att hantera recensioner
import './contact.js'; // Importerar contact.js för att hantera kontaktmeddelanden
import './login.js'; // Importerar login.js för att hantera inloggning
import './adminmenu.js'; // Importerar adminmenu.js för att hantera menyn i inloggad adminläge
import './register.js'; // Importerar register.js för att hantera registrering av nytt adminkonto

import { sendResponse } from './contact.js'; // Importerar putfunktionen från contact.js
// Exponera funktionen globalt
window.sendResponse = sendResponse;

import { updateDish, saveUpdatedDish, cancelUpdate, deleteDish } from './adminmenu.js'; // Importerar funktionerna från adminmenu.js
// Exponera funktionerna globalt så att de kan anropas från HTML
window.updateDish = updateDish;
window.deleteDish = deleteDish;
window.saveUpdatedDish = saveUpdatedDish;
window.cancelUpdate = cancelUpdate;

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

