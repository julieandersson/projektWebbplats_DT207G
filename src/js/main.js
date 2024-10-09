"use strict";

//kod för hamburgermenyn

//element
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

//eventlyssnare
openBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);

//Toggla fram navmeny
function toggleMenu() {
    let navMenuEl = document.getElementById("nav-menu");

    // Hämtar in css för menyn
    let style = window.getComputedStyle(navMenuEl);

    // Kontrollera om nav är synlig elr ej
    if(style.display === "none") {
        navMenuEl.style.display = "block";
    } else {
        navMenuEl.style.display = "none";
    }
}

// Navigeringsknappar på startsidan
document.getElementById('navigateToMenu').addEventListener('click', function() {
    window.location.href = 'menu.html'; // Navigerar till menu.html
});

document.getElementById('navigateToBooking').addEventListener('click', function() {
    window.location.href = 'booking.html'; // Navigerar till booking.html
});

// Skrollar upp på startsidan vid klick av logo i footern
document.getElementById('scrollToTop').addEventListener('click', function(event) {
    event.preventDefault(); // Förhindrar standardlänk-beteendet
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Skapar en smidig scroll-effekt
    });
});
