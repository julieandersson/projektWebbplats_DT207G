"use strict";

// Kontrollera om vi befinner oss på en sida med recensioner (t.ex. reviews.html)
const reviewsContainer = document.getElementById("reviews-container");
const reviewForm = document.getElementById("review-form");

if (reviewsContainer && reviewForm) {
    // Funktion för att hämta och visa recensioner
    async function fetchReviews() {
        const loadingMessage = document.getElementById("loading-message");

    // Visa laddningsmeddelandet innan recensionerna hämtas
    loadingMessage.style.display = "block";
    reviewsContainer.style.display = "none"; // Gömmer recensionerna tills de är färdigladdade

    try {
        // Hämta recensioner från webbtjänsten med ett GET-anrop
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/reviews");
        if (!response.ok) {
            throw new Error("Kunde inte hämta recensioner, försök igen senare.");
        }

        // Om anropet lyckas, konvertera svar till JSON och visa recensionerna 
        const reviewsData = await response.json();
        displayReviews(reviewsData);
    } catch (error) {
        // Vid fel, logga felmeddelande och visa ett meddelande till användaren
        console.error("Fel vid hämtning av recensioner:", error);
        reviewsContainer.innerHTML = "<p>Fel vid hämtning av recensioner, vänligen försök igen senare.</p>";
    } finally {
        // Döljer laddningsmeddelandet och visar recensionerna när hämtningen är klar
        loadingMessage.style.display = "none";
        reviewsContainer.style.display = "block";
    }
}

// Funktion för att visa recensioner i HTML som individuella block/poster
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById("reviews-container");

    // Kontrollera om det finns några recensioner
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>Det finns inga recensioner ännu. Bli den första att lämna en!</p>";
        return; // Avsluta funktionen om inga recensioner finns
    }


    // Skapa individuella block för varje recension
    reviews.forEach(review => {
        // Skapa ett block för varje recension med klass "review-block"
        const reviewBlock = document.createElement("div");
        reviewBlock.classList.add("review-block");

        // Lägg till recensionsdata till blocket
        reviewBlock.innerHTML = `
            <h4>${review.name}</h4>
            <p><strong>Betyg: ${review.rating}/5</strong></p>
            <p>${review.comment}</p>
        `;

        // Lägg till recensionsblocket i reviewsContainer
        reviewsContainer.appendChild(reviewBlock);
    });
}

// Funktion för att skicka en ny recension via formulär
async function submitReview(event) {
    event.preventDefault(); // Förhindrar standardformulärinlämning

    // Hämtar värden från formuläret
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    const rating = document.getElementById("rating").value;

    const errorMessageDiv = document.getElementById("error-message");
    const successMessageDiv = document.getElementById("success-message");

    // Töm eventuella tidigare meddelanden
    errorMessageDiv.textContent = '';
    successMessageDiv.textContent = '';

    try {
        // Skicka recension till webbtjänst med ett POST-anrop
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, comment, rating }) // Skickar datan i JSON-format
        });

        // Om svaret inte är OK, kontrollera om det är ett valideringsfel
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.error) {
                // Visa de specifika valideringsfelen från servern
                errorMessageDiv.textContent = `${errorData.error}`;
            } else {
                // Om det inte är ett valideringsfel, visa ett generellt felmeddelande
                throw new Error("Kunde inte skicka recensionen, vänligen försök igen.");
            }
        } else {
            // Lägg till den nya recensionen direkt utan att ladda om sidan
            const newReview = await response.json();
            addReviewToList(newReview.review);

            // Visa ett framgångsmeddelande
            successMessageDiv.textContent = "Tack för din recension! Din åsikt betyder mycket för oss.";

        // Töm formuläret efter att recensionen har skickats
        document.getElementById("review-form").reset();
        }

    } catch (error) {
        // Vid fel, logga felmeddelade och visa ett felmeddelande till användaren
        console.error("Fel vid skickning av recension:", error);
        alert("Något gick fel. Försök igen.");
    }
}
    // Funktion för att lägga till den nya recensionen direkt som ett block/en post
    function addReviewToList(review) {
        // Skapar ett nytt block för den nya recensionen med klass "review-block"
        const reviewBlock = document.createElement("div");
        reviewBlock.classList.add("review-block");

        // Lägg till recensionsdata till blocket
        reviewBlock.innerHTML = `
            <h4>${review.name}</h4>
            <p><strong>Betyg: ${review.rating}/5</strong></p>
            <p>${review.comment}</p>
        `;
        reviewsContainer.appendChild(reviewBlock);
    }

    // Lägg till eventlyssnare
    reviewForm.addEventListener("submit", submitReview);
    // Hämta och visa recensioner när sidan laddas
    fetchReviews();
}