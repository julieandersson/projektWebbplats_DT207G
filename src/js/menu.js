/* SE MENYN PÅ WEBBPLATSEN */

"use strict";

// Objekt som innehåller bildsökvägar för varje kategori
const categoryImages = {
    "Förrätt": new URL('../images/appetizer.jpg', import.meta.url),
    "Nigiri": new URL('../images/sushi.jpg', import.meta.url),
    "Varma rätter": new URL('../images/ramen.jpg', import.meta.url),
    "Dessert": new URL('../images/dessert.jpg', import.meta.url),
    "Cocktails": new URL('../images/cocktails.jpg', import.meta.url),
    "Pokebowl": new URL('../images/pokebowl.jpg', import.meta.url)
};

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

// Funktion för att visa menyn i HTML grupperad efter kategori
function displayMenu(menuItems) {
    // Hämtar elementet där menyn ska visas
    const menuContainer = document.getElementById("menu-container");

    // Kontrollera om det finns några maträtter i menyn
    if (menuItems.length === 0) {
        // Om tom, visa meddelande
        menuContainer.innerHTML = "<p>Menyn är tom, inga maträtter hittades.</p>";
        return;
    }

    // Gruppera menyalternativen efter deras kategori
    const categories = {};
    menuItems.forEach(item => {
        // Om kategorin inte redan finns, skapa en ny tom lista
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        // Lägg till maträtten till rätt kategori
        categories[item.category].push(item);
    });

    // Skapa HTML-strukturen för att visa kategorier och maträtter
    for (const category in categories) {
        // Skapa en bild för varje kategori om den finns i objektet
        if (categoryImages[category]) {
            const categoryImage = document.createElement("img");
            categoryImage.src = categoryImages[category];
            categoryImage.alt = `${category} image`;
            categoryImage.classList.add("category-image"); // Skapar en klass för styling av bilderna i SCSS
            categoryImage.onerror = () => {
                console.error(`Bild kunde inte laddas: ${categoryImages[category]}`);
            };
            menuContainer.appendChild(categoryImage);
        }

        // Skapa en rubrik för varje kategori
        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = category;
        menuContainer.appendChild(categoryTitle);

        // Skapa en lista för varje kategori
        const categoryList = document.createElement("ul");
        categoryList.classList.add("menu-list");
        categories[category].forEach(item => {
            const menuItem = document.createElement("li");
            menuItem.innerHTML = `<strong>${item.name}</strong> - ${item.description} (Pris: ${item.price} kr)`;
            categoryList.appendChild(menuItem);
        });

    // Lägg till komplett lista i menuContainer 
    menuContainer.appendChild(categoryList);

   }
}
