# Cahier des Charges Fonctionnel et Technique — Site EURL ROMAISA LIRAY

**Version :** 1.1 — Juillet 2026  
**Projet :** Site vitrine pour entreprise d'assainissement et d'hydraulique  
**URL de production :** `https://romaisa-liray-eta.vercel.app`

---

## 1. Présentation du Projet & Objectifs

Site vitrine moderne, professionnel et rassurant pour une EURL spécialisée dans les travaux d'assainissement et d'hydraulique.  
Le site doit :

- Refléter l'expertise technique de l'entreprise
- Attirer de nouveaux clients (collectivités, entreprises, particuliers)
- Faciliter la prise de contact
- Permettre une administration autonome du contenu

---

## 2. Stack Technique (Réalisé)

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js 14 (App Router) | 14.2.5 |
| Langage | TypeScript | 5.6+ |
| Styling | Tailwind CSS + CSS Modules | 3.4.4 |
| Base de données | PostgreSQL via Neon (cloud) + Prisma ORM | 5.11+ |
| Authentification | Session token signé HMAC-SHA256 | — |
| Icônes | react-icons (Feather Icons) | 5.7.0 |
| Upload fichiers | API Route + FileReader base64 | — |
| Hébergement | Vercel (serverless) | — |

---

## 3. Arborescence et Structure (Réalisé)

### 3.1 Page Publique (One-Page Scroll)

```
┌─ HEADER (sticky, navigation ancrée, menu mobile hamburger)
├─ Section #accueil (Hero)
│   ├─ Image de fond pleine largeur
│   ├─ Overlay radial gradient + ovale blanc flouté
│   ├─ Logo + marque (EURL ROMAISA LIRAY)
│   ├─ Titre principal + sous-titre
│   └─ Footer bar : 4 piliers (Assainissement, Réseaux Hydrauliques, Solutions Techniques, Durabilité)
│
├─ Section #apropos (Qui sommes-nous + Pourquoi nous choisir)
│   ├─ Bloc présentation entreprise
│   ├─ 4 cartes "valeurs" (features)
│   └─ Responsive : 2×2 grid sur tablette, 1 col sur mobile
│
├─ Section #services (Nos domaines d'intervention)
│   ├─ Grille de cartes service avec numéro, icône, titre, description
│   ├─ Pagination coté admin
│   └─ Images optionnelles par service
│
├─ Section #realisations (Galerie de réalisations)
│   ├─ Grille responsive (6 desktop / 3 mobile)
│   ├─ Pagination avec Précédent/Suivant
│   ├─ Mise à jour URL searchParams (?projectsPage=N)
│   └─ Bloc clients associé avec slider
│
├─ Section #references (Références clients)
│   ├─ Tableau "Maîtres d'ouvrage publics"
│   ├─ Tableau "Entreprises publiques et privées"
│   ├─ Pagination indépendante par tableau
│   └─ Icônes de validation par référence
│
├─ Section #contact
│   ├─ Coordonnées (email, téléphone, adresse)
│   └─ Gérées depuis le dashboard admin
│
└─ FOOTER
    ├─ © 2026 EURL ROMAISA LIRAY
    └─ Travaux d'assainissement et hydraulique
```

### 3.2 Espace Administration

```
/admin/login          — Connexion (email + mot de passe)
/admin/dashboard      — Tableau de bord principal
│                       ├─ Infos profil admin
│                       ├─ Sécurité du compte (email, mot de passe)
│                       └─ Coordonnées publiques (email, adresse, téléphones)
│
/admin/account        — Mon compte (nom, email, mot de passe)
/admin/projects       — Gestion des réalisations (CRUD)
│                       ├─ Ajout avec upload image
│                       ├─ Modification avec upload image
│                       └─ Suppression avec confirmation
│
/admin/services       — Gestion des services (CRUD)
│                       ├─ Numéro, titre, description, icône, image
│                       └─ Upload image optionnel
│
/admin/references     — Gestion des références (CRUD)
│                       ├─ 2 catégories : Public / Entreprise
│                       └─ Nom + description + type
│
/admin/clients        — Gestion des clients (CRUD)
│                       └─ Nom + logo (upload)
```

---

## 4. Fonctionnalités Réalisées

### 4.1 Partie Publique

- [x] Header sticky avec navigation fluide (ancres)
- [x] Menu mobile responsive (hamburger → overlay)
- [x] Hero avec image de fond, overlay, brand, titre
- [x] Section "Qui sommes-nous" avec carte de valeurs
- [x] Section "Services" avec grille dynamique
- [x] Section "Réalisations" avec pagination
- [x] Section "Clients" avec slider
- [x] Section "Références" avec 2 tableaux paginés
- [x] Section Contact avec coordonnées
- [x] Footer
- [x] Design responsive (mobile, tablette, desktop)
- [x] Animations CSS (fadeIn, slideIn)
- [x] Scroll fluide avec décalage header

### 4.2 Authentification & Sécurité

- [x] Middleware de protection des routes admin
- [x] Session token signé (HMAC-SHA256)
- [x] Durée de session : 1 an
- [x] Redirection automatique vers login si non authentifié
- [x] Déconnexion

### 4.3 Administration

- [x] CRUD complet pour projets, services, références, clients
- [x] Upload d'images (base64 → serveur)
- [x] Pagination des réalisations (URL searchParams)
- [x] Recherche par mot-clé sur chaque page admin
- [x] Notifications toast (succès, erreur, info)
  - [x] Ajout / Modification / Suppression
  - [x] Upload échoué
  - [x] Validation de formulaire
- [x] Gestion du compte admin (email, mot de passe)
- [x] Gestion des coordonnées publiques (email, adresse, téléphones)

### 4.4 Base de Données (Prisma / PostgreSQL sur Neon)

- [x] Modèle `AdminUser`
- [x] Modèle `Project`
- [x] Modèle `Service`
- [x] Modèle `Reference`
- [x] Modèle `Client`
- [x] Seed initial avec données de démo

---

## 5. Fonctionnalités à Ajouter / Améliorer

### 5.1 Haute Priorité

- [ ] **Formulaire de contact fonctionnel** — Actuellement les coordonnées sont affichées mais le formulaire d'envoi n'est pas implémenté (API route `/api/admin/contact` en lecture seule)
- [ ] **Section "Pourquoi nous choisir" éditable** — Les cartes "valeurs" sont en dur dans `AboutSection.tsx`. Prévoir un CRUD en admin.
- [ ] **Section À propos éditable** — Le texte de présentation est en dur. Ajouter un modèle `AboutContent` en base.

### 5.2 Priorité Moyenne

- [ ] **Galerie de réalisations** — Améliorer l'affichage (mode masonry, lightbox au clic)
- [ ] **SEO avancé** — Ajouter `next-seo` ou metadata dynamique par page
- [ ] **Plan du site** — Générer un `sitemap.xml` dynamique
- [ ] **Mentions légales** — Page dédiée ou section dans le footer
- [ ] **Certifications / Labels** — Section dédiée dans la page d'accueil
- [ ] **Multilingue** — Support français/arabe (marché algérien)

### 5.3 Priorité Faible

- [ ] **PWA** — Service worker + manifest pour installation mobile
- [ ] **Analytics** — Intégration Google Analytics 4 ou Plausible
- [ ] **Cookies banner** — Conformité RGPD si analytics
- [ ] **Tests** — Tests unitaires (Jest/Vitest) + E2E (Playwright)
- [ ] **CI/CD** — Pipeline GitHub Actions pour lint + build + deploy

---

## 6. Pages Administrées (Backend CRUD)

| Entité   | API Routes                | Admin Page          | Base de données |
|----------|---------------------------|---------------------|-----------------|
| Projets  | `api/admin/projects`      | `/admin/projects`   | `Project`       |
| Services | `api/admin/services`      | `/admin/services`   | `Service`       |
| Réf.     | `api/admin/references`    | `/admin/references` | `Reference`     |
| Clients  | `api/admin/clients`       | `/admin/clients`    | `Client`        |
| Contact  | `api/admin/contact` (GET) | Dashboard           | `Contact`       |
| Compte   | `api/admin/account`       | `/admin/account`    | `AdminUser`     |
| Upload   | `api/admin/upload`        | —                   | Fichiers        |

---

## 7. Spécifications Techniques Détaillées

### 7.1 Frontend

- **Rendu :** Server Components (RSC) par défaut, Client Components ("use client") pour l'interactivité
- **Routing :** App Router de Next.js 14
- **CSS :** Tailwind CSS pour la mise en page + CSS Modules pour les styles spécifiques
- **Polices :** DM Sans (texte), Bebas Neue (titres)
- **Icônes :** Feather Icons (react-icons/fi)
- **Design :** Brutalist cartoon — contours noirs marqués, couleurs plates, ombres portées

### 7.2 Backend

- **API :** Next.js API Routes (App Router)
- **Base de données :** PostgreSQL hébergé sur Neon (cloud) — pas de SQLite
- **ORM :** Prisma (avec Proxy wrapper pour la gestion d'erreurs)
- **Auth :** Session token custom (pas de lib externe)
  - Cookie signé HMAC-SHA256
  - Stocké côté client, vérifié en middleware
- **Upload :** API Route qui reçoit base64 → sauvegarde dans `public/uploads/`

### 7.3 Structure du Projet

```
/
├── app/
│   ├── layout.tsx            — Layout racine (meta, fonts)
│   ├── page.tsx              — Page d'accueil (one-page)
│   ├── globals.css           — Styles globaux + Tailwind
│   ├── api/admin/            — API Routes admin
│   └── admin/                — Pages admin (layout, login, dashboard, CRUDs)
│
├── components/               — Composants React
│   ├── HeroSection.tsx       — Section héro
│   ├── AboutSection.tsx      — Présentation + valeurs (contenu statique)
│   ├── ServicesSection.tsx    — Services (serveur)
│   ├── ProjectsSection.tsx    — Réalisations (serveur)
│   ├── ProjectsSectionClient.tsx — Pagination réalisations + clients (client)
│   ├── ReferencesSection.tsx  — Références (serveur)
│   ├── ReferencesSectionClient.tsx — Pagination références (client)
│   ├── ContactSection.tsx     — Contact
│   ├── Header.tsx             — Navigation (client)
│   ├── AdminNav.tsx           — Navigation admin
│   ├── AdminNotification.tsx  — Toast notifications
│   ├── FeatureBlock.tsx       — Bloc valeur
│   ├── ServiceCard.tsx        — Carte service
│   ├── SectionHeading.tsx     — Titre de section
│   ├── SectionTitle.tsx       — Titre stylisé
│   └── *.module.css           — Styles modules
│
├── lib/
│   ├── prisma.ts              — Instance Prisma singleton
│   └── adminAuth.ts           — Auth (token, cookie)
│
├── prisma/
│   ├── schema.prisma          — Schéma de données
│   └── seed.js                — Données de démo
│
├── middleware.ts              — Protection routes admin
├── tailwind.config.ts         — Configuration Tailwind
└── next.config.mjs            — Configuration Next.js
```

---

## 8. Modèle de Données (Prisma) — Réel (extrait du `schema.prisma`)

```prisma
// datasource : PostgreSQL (Neon)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
}

model ContactSetting {
  id           Int           @id @default(autoincrement())
  email        String
  address      String
  updatedAt    DateTime      @updatedAt
  phoneNumbers PhoneNumber[]
}

model PhoneNumber {
  id               Int             @id @default(autoincrement())
  number           String
  contactSettingId Int?
  contactSetting   ContactSetting? @relation(fields: [contactSettingId], references: [id])
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  image       String
  client      String
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Reference {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Service {
  id          Int      @id @default(autoincrement())
  number      String   @unique
  title       String
  description String
  icon        String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Client {
  id          Int     @id @default(autoincrement())
  name        String
  logo        String?
  description String?
  website     String?
}

```

> **Note :** 7 modèles au total, avec relation `ContactSetting → PhoneNumber`. Pas de formulaire de contact (non souhaité), pas de modèle `Section` (inutilisé).

---

## 9. Déploiement

- **Hébergement :** Vercel (serverless)
- **Base de données :** PostgreSQL sur **Neon** (cloud) — **déjà en production**
  - `provider = "postgresql"` dans `schema.prisma`
  - URL de connexion : `postgresql://neondb_owner:***@ep-quiet-breeze-avzemdki-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Variables d'environnement :**
  - `DATABASE_URL` — URL de connexion à la base PostgreSQL Neon
  - `ADMIN_SESSION_SECRET` — Clé secrète pour les tokens de session

### Commandes

```bash
npm run dev          # Développement local (next dev)
npm run build        # Build production
npm run start        # Lancement production
npx prisma studio    # Interface graphique BDD (Neon en ligne)
npm run db:seed      # Réinitialiser les données de démo
```

---

## 10. État Général du Projet

| Aspect                | Statut            |
|-----------------------|-------------------|
| Partie publique       | ✅ 95% complet    |
| Backend & API       | ✅ 100% complet  |
| Authentification    | ✅ 100% complet  |
| Administration CRUD | ✅ 100% complet  |
| Notifications toast | ✅ 100% complet  |
| Base de données     | ✅ 100% complet  |
| Déploiement Vercel  | ✅ Effectué      |
| **Total**           | **~90%**         |

### Restant à faire (cf. section 5)

| Priorité | Tâche | Effort estimé |
|----------|-------|---------------|
| Haute    | Formulaire contact fonctionnel | 2-3 jours |
| Haute    | Section "Valeurs" éditable (admin) | 1-2 jours |
| Haute    | Section "À propos" éditable | 1-2 jours |
| Moyenne  | Lightbox galerie | 1 jour |
| Moyenne  | Sitemap + SEO | 0.5 jour |
| Moyenne  | Mentions légales | 0.5 jour |
| Faible   | PWA | 2 jours |
| Faible   | Tests | 3-5 jours |

---

*Document généré le 29 juillet 2026 — basé sur l'analyse complète du code source.*
