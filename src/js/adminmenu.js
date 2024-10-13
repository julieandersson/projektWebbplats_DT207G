/* MENY MED POST, PUT, DELETE I INLOGGAT LÄGE (för admin) */

import { fetchMenu } from './menu.js'; // Importerar fetchMenu från menu.js för att uppdatera menyn efter ändringar

"use strict";

// Funktion för att lägga till en ny maträtt (POST)
async function addDish(event) {
    event.preventDefault(); // Förhindra standardformulärets beteende

    // Hämta värden från formuläret
    const name = document.getElementById("dish-name").value;
    const description = document.getElementById("dish-description").value;
    const price = document.getElementById("dish-price").value;
    const category = document.getElementById("dish-category").value;

    try {
        const token = localStorage.getItem("authToken"); // Hämta token från localStorage för att kontrollera om admin är inloggad

        // Skickar en POST-förfrågan för att lägga till ny maträtt
        const response = await fetch("https://projektwebservice-dt207g.onrender.com/api/cuisine", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // skickar med token i förfrågan
            },
            body: JSON.stringify({ name, description, price, category })
        });

        const result = await response.json();


        if (response.ok) {
            alert(result.message); // Visa bekräftelsemeddelande
            fetchMenu(); // Uppdatera menyn så att den nya rätten visas
            document.getElementById("add-dish-form").reset(); // Rensar formuläret efter att maträtten har lagts till

        } else {
            // Om något gick fel, visa felmeddelande
            alert(result.error || "Kunde inte lägga till maträtten. Försök igen.");
        }
    } catch (error) {
        // Allmänt felmeddelande om servern inte svarar
        console.error("Ett fel inträffade vid tillägg av maträtten:", error);
        alert("Ett serverfel uppstod, vänligen försök igen senare.");
    }
}

// Funktion för att uppdatera en maträtt genom ett formulär (PUT)
export function updateDish(dishId, name, description, price, category) {
    // Kollar om formuläret redan finns på sidan för att undvika att skapa flera
    const formContainer = document.getElementById(`update-form-${dishId}`);
    if (formContainer) {
        // Om formuläret redan finns, visa det bara igen
        formContainer.style.display = 'block';
    } else {
        // Om formuläret inte finns, skapa ett nytt för att uppdatera maträtten
        const menuItemElement = document.querySelector(`#menu-item-${dishId}`);
        const updateForm = document.createElement('form');
        updateForm.id = `update-form-${dishId}`;
        updateForm.className = 'update-form'; 
        updateForm.innerHTML = `
            <input type="text" id="update-name-${dishId}" value="${name}" placeholder="Namn">
            <input type="text" id="update-description-${dishId}" value="${description}" placeholder="Beskrivning">
            <input type="number" id="update-price-${dishId}" value="${price}" placeholder="Pris">
            <select id="update-category-${dishId}">
                <option value="Förrätt" ${category === 'Förrätt' ? 'selected' : ''}>Förrätt</option>
                <option value="Nigiri" ${category === 'Nigiri' ? 'selected' : ''}>Nigiri</option>
                <option value="Maki" ${category === 'Maki' ? 'selected' : ''}>Maki</option>
                <option value="Pokebowl" ${category === 'Pokebowl' ? 'selected' : ''}>Pokebowl</option>
                <option value="Varma rätter" ${category === 'Varma rätter' ? 'selected' : ''}>Varma rätter</option>
                <option value="Dessert" ${category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                <option value="Cocktails" ${category === 'Cocktails' ? 'selected' : ''}>Cocktails</option>
            </select>
            <button type="button" onclick="saveUpdatedDish('${dishId}')">Spara</button>
            <button type="button" onclick="cancelUpdate('${dishId}')">Avbryt</button>
        `;

        // Lägg till det nya formuläret precis under maträtten som ska uppdateras
        menuItemElement.appendChild(updateForm);
    }
}

// Funktion för att spara den uppdaterade maträtten (PUT)
export async function saveUpdatedDish(dishId) {
    // Hämtar de nya värdena från formuläret i ändringarna som gjorts
    const newName = document.getElementById(`update-name-${dishId}`).value.trim();
    const newDescription = document.getElementById(`update-description-${dishId}`).value.trim();
    const newPrice = document.getElementById(`update-price-${dishId}`).value.trim();
    const newCategory = document.getElementById(`update-category-${dishId}`).value.trim();


    // Kontrollera att de obligatoriska fälten är ifyllda
    if (!newName || !newPrice || !newCategory) {
        alert("Vänligen fyll i alla obligatoriska fält: namn, pris och kategori.");
        return; // Avbryt uppdateringen om fälten inte är ifyllda
    }

    try {
        const token = localStorage.getItem("authToken"); // Hämtar token

        // Skicka PUT-förfrågan med de nya värdena för att uppdatera maträtten
        const response = await fetch(`https://projektwebservice-dt207g.onrender.com/api/cuisine/${dishId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: newName, description: newDescription, price: newPrice, category: newCategory })
        });

        const result = await response.json();


        if (response.ok) {
            alert(result.message); // Visa bekräftelsemeddelande
            fetchMenu(); // Uppdatera menyn så att ändringen visas direkt
        } else {
            alert(result.error || "Kunde inte uppdatera maträtten. Försök igen.");
        }
    } catch (error) {
        console.error("Ett fel inträffade vid uppdatering av maträtten:", error);
        alert("Ett serverfel uppstod, vänligen försök igen senare.");
    }
}

// Funktion för att avbryta uppdateringen och gömma formuläret om admin ångrar sig och klickar på "avbryt"
export function cancelUpdate(dishId) {
    const formContainer = document.getElementById(`update-form-${dishId}`);
    if (formContainer) {
        formContainer.style.display = 'none'; // döljer formuläret
    }
}


// Funktion för att ta bort en maträtt (DELETE)
export async function deleteDish(dishId) {
    const confirmed = confirm("Är du säker på att du vill ta bort denna maträtt?");
    if (!confirmed) return; // Om admin klickar avbryt, gör ingenting

    try {
        const token = localStorage.getItem("authToken"); // Hämta token från localStorage

        // Skicka DELETE-förfrågan för att ta bort maträtten
        const response = await fetch(`https://projektwebservice-dt207g.onrender.com/api/cuisine/${dishId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Visa bekräftelsemeddelande
            // Uppdatera menyn så att borttagningen visas direkt
            fetchMenu();
        } else {
            alert(result.error || "Kunde inte ta bort maträtten. Försök igen.");
        }
    } catch (error) {
        console.error("Ett fel inträffade vid borttagning av maträtten:", error);
        alert("Ett serverfel uppstod, vänligen försök igen senare.");
    }
}

// Lägg till eventlyssnare för att hantera tillägg av ny maträtt när sidan har laddats
document.addEventListener("DOMContentLoaded", () => {
    const addDishForm = document.getElementById("add-dish-form");
    if (addDishForm) {
        addDishForm.addEventListener("submit", addDish); // Lägg till eventlyssnare för formuläret
    }
});