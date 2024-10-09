"use strict";

// Funktion för att hämta menyn från webbtjänsten
export async function fetchMenu() {
    // Hämtar htmlelement där menyn och laddningsmeddelandet ska visas
    const menuContainer = document.getElementById("menu-container");
    const loadingMessage = document.getElementById("loading-message");

    // Kontrollera om vi är på menysidan där menyn faktiskt ska ladda och hämtas
    if (!menuContainer || !loadingMessage) {
        // Om elementen inte finns och vi inte är på menysidan, avsluta funktionen utan att göra något
        return;
    }

    try {
        // Anropar webbtjänsten för att hämta menyn med GET-anrop
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/cuisine");
        
        if (!response.ok) {
            throw new Error("Kunde inte hämta menyn, försök igen senare.");
        }

        // Om anrop lyckas, konvertera från JSON-format till ett JavaScript-objekt
        const menuData = await response.json();

        // Anropa funktionen som visar menyn i html
        displayMenu(menuData);

    } catch (error) {
        // Om ett fel uppstår, logga fel i konsolen och visa felmeddelande på webbplatsen
        console.error("Fel vid hämtning av menyn:", error);
        menuContainer.innerHTML = "<p>Fel vid hämtning av menyn, vänligen försök igen senare.</p>";
    } finally {
        // Döljer laddningsmeddelandet oavsett om anrop lyckas eller ej
        loadingMessage.style.display = "none";
    }
}

// Funktion för att visa menyn i HTML
function displayMenu(menuItems) {
    // Hämtar elementet där menyn ska visas
    const menuContainer = document.getElementById("menu-container");

    // Kontrollera om det finns några maträtter i menyn
    if (menuItems.length === 0) {
        // Om tom, visa meddelande
        menuContainer.innerHTML = "<p>Menyn är tom, inga maträtter hittades.</p>";
        return;
    }

    // Skapar en lista för att visa menyn
    const menuList = document.createElement("ul");

    // Loopa varje menyalternativ och skapa listobjekt
    menuItems.forEach(item => {
        const menuItem = document.createElement("li");
        // Fyll listobjektet med namn, beskrivning och pris
        menuItem.innerHTML = `<strong>${item.name}</strong> - ${item.description} (Pris: ${item.price} kr)`;
        // Lägg till i listan
        menuList.appendChild(menuItem);
    });

    // Lägg till komplett lista i menuContainer 
    menuContainer.appendChild(menuList);
}
