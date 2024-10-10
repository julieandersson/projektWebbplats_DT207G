/* LOGIN FUNKTION */
"use strict";

// Hämtar inloggningsformuläret och felmeddelande-elementet
const loginFormElement = document.querySelector("#login-form");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const loadingIndicator = document.getElementById("loading-indicator");

// Funktion för att visa laddningsstatus när inloggningen pågår
function showLoadingIndicator() {
  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }
}

// Funktion för att dölja laddningsstatus när inloggningen är klar
function hideLoadingIndicator() {
  if (loadingIndicator) {
    loadingIndicator.style.display = "none";
  }
}

// När användaren skickar in formuläret (klickar på "Logga in")
if (loginFormElement) {
  loginFormElement.addEventListener("submit", async (event) => {
    event.preventDefault(); // Förhindrar att sidan laddas om vid inmatning

    // Hämtar användarnamn och lösenord från formuläret
    const usernameInput = document.querySelector("#username").value;
    const passwordInput = document.querySelector("#password").value;

    // Skapar ett objekt med inloggningsuppgifterna
    const credentials = { username: usernameInput, password: passwordInput };

    try {
      // Visa laddningsindikatorn under inloggningsprocessen
      showLoadingIndicator();

      // Skickar inloggningsuppgifterna till API:et
      const apiResponse = await fetch("https://projektwebservice-dt207g.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Omvandlar till JSON-format
      });

      const responseData = await apiResponse.json();

      if (apiResponse.ok) {
        // Om inloggningen lyckades, spara token i localStorage
        localStorage.setItem("authToken", responseData.response.token);
        // Spara användarnamnet i localStorage
        localStorage.setItem("loggedInUser", usernameInput);

        // Skicka användaren till den inloggade sidan
        window.location.href = "loggedin.html";
      } else {
        // Om inloggningen misslyckas, visa felmeddelandet
        loginErrorMessage.textContent = `${responseData.error}`;
        loginErrorMessage.style.display = "block";
      }
    } catch (error) {
      // Visa ett generellt felmeddelande om något går fel vid inloggning
      console.error("Inloggningen misslyckades: ", error);
      loginErrorMessage.textContent = "Något gick fel, försök igen senare.";
      loginErrorMessage.style.display = "block";
    } finally {
      // Dölj laddningsindikatorn när inloggningsprocessen är klar
      hideLoadingIndicator();
    }
  });
}
