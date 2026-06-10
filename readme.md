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

- Ye Htet Rohim

---

## 💻 Gebruikte Talen & Technologieën

- PostgreSQL – Database  
- Node.js – Backend runtime  
- Express – Web framework  
- Clerk - Authentication 
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
- `release/*` → Releases voorbereiden  

### Werkwijze

1. Maak een nieuwe branch vanuit `develop`:  `feature/nieuwe-functionaliteit`
2. Werk je feature uit  
3. Maak een Pull Request naar `develop`  
4. Na goedkeuring wordt de code gemerged  

---

## 🔐 Threat Model Implementatie

In dit project zijn beveiligingsmaatregelen genomen op basis van het threat model.

### Threat #20: Spoofing the Admin/User External Entity

- **Risk:** Admin/User may be spoofed by an attacker, and this may lead to unauthorized access to SPA (React.js). Consider using a standard authentication mechanism to identify the external entity.
- **Mitigatiion:** Authentication via an extern provider with bearer tokens  
- **Implementation:**  
  - File Frontend: `website\src\hooks\useAuthReq.js`  
  - File Backend: `Almost all routes are authentication dependent.`
  - Example: see `businesslogic\src\routes\transactionsRoutes.ts line: 7`
  - Solution: Authentication must be enforced via a trusted method (e.g., external auth provider and tokens). Without proper verification, attackers can impersonate legitimate users and gain access to sensitive data. 

---

## Gebruik

De webiste is online beschikbaar: https://showcase-8bgp.onrender.com/
---