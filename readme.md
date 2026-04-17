# 📊 Financieel Dashboard

Welkom bij het Financieel Dashboard project! Dit project is ontwikkeld als onderdeel van een schoolopdracht en biedt inzicht in financiële gegevens via een interactieve webapplicatie.

---

## 🚀 Functionaliteiten

- 📈 Overzicht van inkomsten en uitgaven  
- 📊 Visualisatie van data (grafieken en tabellen)  
- 🔍 Filteren op datum, categorie en type  
- 👤 Gebruikersauthenticatie (inloggen/registreren)  
- 💾 Opslaan en ophalen van financiële data uit database  
- 📉 Dashboard met real-time updates  

---

## 👥 Contributor

- Jouw Naam (vervang dit met je eigen naam)
- Eventuele teamleden

---

## 💻 Gebruikte Talen & Technologieën

- PostgreSQL – Database  
- Node.js – Backend runtime  
- Express – Web framework  
- TypeScript – Type safety  
- JavaScript (JS) – Scripting  
- React (JSX) – Frontend UI  
- CSS – Styling  

---

## 🌿 Gitflow

Binnen dit project wordt de Gitflow workflow gebruikt:

- `main` → Bevat stabiele productiecode  
- `develop` → Hoofdbranch voor development  
- `feature/*` → Nieuwe features  
- `bugfix/*` → Bugfixes  
- `release/*` → Releases voorbereiden  

### Werkwijze

1. Maak een nieuwe branch vanuit `develop`:  
   `feature/nieuwe-functionaliteit`
2. Werk je feature uit  
3. Maak een Pull Request naar `develop`  
4. Na goedkeuring wordt de code gemerged  

---

## 🔐 Threat Model Implementatie

In dit project zijn beveiligingsmaatregelen genomen op basis van het threat model.

### Bedreiging #1: Cross-Site Request Forgery (CSRF)

- **Risico:** Kwaadwillende requests kunnen namens een gebruiker uitgevoerd worden  
- **Mitigatie:** CSRF-tokens toegevoegd aan POST-requests  
- **Implementatie:**  
  - Bestand: `middleware/csrf.ts`  
  - Oplossing: Validatie van CSRF-token bij elke POST-request  

---

## ⚙️ Installatie & Gebruik

Clone repository
```git clone <repo-url>```

Installeer dependencies
```npm install```

Start backend
```npm run dev```

Start frontend
```npm run dev```






---
Setting up the backend

npm installations for the backend
npm init -y (package json)
npm i express
npm install express@5.2.1 cors@2.8.5 dotenv@17.2.3 drizzle-orm@0.44.7 pg@8.16.3 @clerk/express@1.0.1 

i use typescript in the dev fase
npm install -D typescript@5.9.3 ts-node@10.9.2 nodemon@3.1.11 drizzle-kit@0.31.7 @types/express@5.0.6 @types/cors@2.8.19 @types/pg@8.15.6

add tsconfig.json so that type script can run with node

scripts under de package.json
    "dev": "nodemon",
    "build": "tsc" will create a file under dist to compile ts into js
add nodemon.json in de backend

add .env file
-PORT, DB_URL, BASE_URl, NODE_ENV, CLERK KEys


db push schema code

---
Setting up the frontend

npm installation for the frontend
npm create vite@latest .
