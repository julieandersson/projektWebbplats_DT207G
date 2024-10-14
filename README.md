# Moment 5 PROJEKT - DT207G - Backend-baserad webbutveckling
## Steg 2: Projektwebbplats

Denna uppgift är steg 2 i moment 5 i kursen DT207G och innefattar en projektwebbplats. Webbplatsen använder Fetch API för att konsumera den REST-webbtjänst som skapades i steg 1 https://github.com/julieandersson/projektWebservice_DT207G.git. Webbplatsen representerar en applikation för en fiktiv restaurang vid namn "Nami Sushi" som erbjuder mat inspirerad av traditionella smaker från Japan. På webbplatsen kan besökare se aktuell meny, boka bord, skriva kontaktmeddelanden/frågor samt skriva och läsa recensioner. På startsidan finns en kort presentation/beskrivning om företaget. 
På webbplatsen kan även medarbetare logga in och göra ändringar på webbplatsen. Detta är skyddade delar som endast admin har åtkomst till och hanteras med JWT (JSON Web Tokens).

## Funktionalitet

### För besökare av webbplatsen:
- Se meny (med matchande bilder)
- Boka bord via ett formulär
- Skicka meddelanden/kontakta restaurangen via ett formulär
- Lämna recensioner via ett formulär samt läsa andra gästers recensioner.

### För medarbetare (admin-funktioner som kräver autentiserad inloggning):
- Se aktuella bokningar som gjorts av besökare på sidan
- Se och besvara meddelanden/frågor som kommit in
- Skapa nytt adminkonto (om tex en viss avdelning vill ha ett eget konto för deras ansvarsområde; hantering av menyn, bokningar etc.)
- Lägga till ny maträtt på menyn
- Ta bort maträtter från menyn
- Uppdatera/ändra maträtter från menyn

## Säkerhet
Webbplatsen använder JWT (JSON Web Tokens) för autentisering och ser till att endast behöriga användare har åtkomst till de administrativa funktionerna. Vid skapade av nytt inlogg hashas lösenordet. JWT sparas i localStorage i 1 timme, därefter måste admin logga in på nytt för att få tillgång till funktionerna. 

## Använda tekniker
Denna webbplats är skapad med HTML, SCSS med olika partials för en tydligare CSS-struktur samt JavaScript. Fetch API har använts för att skicka, ta emot, ändra och radera data till och från webbtjänsten. JWT (JSON Web Tokens) har använts för autentisering och åtkomstkontroll av skyddade resurser. Parcel har använts för en automatiserad utvecklingsmiljö. Github har använts för regelbundna commits av arbetet och webbplatsen är publicerad via Netlify. 

## Skapad av:
- Julie Andersson
- Webbutvecklingsprogrammet på Mittuniversitetet i Sundsvall
- Moment 5 ProjektWebbplats - kurs DT207G - Backendbaserad webbutveckling