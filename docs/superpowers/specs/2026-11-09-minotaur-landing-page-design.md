# Specification: Minotaur Launcher Landing Page (`apps/landing`)

- **Author:** Antigravity & User (`alvyn16`)
- **Date:** 2026-11-09
- **Status:** Approved for Implementation Planning
- **Target Repository:** [https://github.com/alvyn16/Minotaur](https://github.com/alvyn16/Minotaur)

---

## 1. Project Overview & Intent

Minotaur Launcher is a modern, high-performance, open-source Minecraft launcher built on Tauri v2 (Rust) and Vue 3. To allow regular players and community members to discover and install the launcher easily, this project creates a dedicated, lightweight, and responsive landing page hosted on Vercel.

### Success Criteria
1. **Visual Impact:** Matches the Minotaur dark UI theme (`#0e1317`) with emerald green accents (`#1bd96a`).
2. **Conversion Focus:** Prominent "Download for Windows" button linking directly to the latest release executable.
3. **Player Onboarding:** Friendly visual guidance addressing Windows SmartScreen warnings on open-source binaries.
4. **Blazing Performance:** 100/100 Lighthouse score achieved via static edge rendering in Astro + Tailwind CSS.
5. **Vercel Readiness:** Seamless zero-configuration deployment by pointing Vercel to `apps/landing`.

---

## 2. Technology Stack & Monorepo Integration

| Component | Choice | Rationale |
|---|---|---|
| **Location** | `apps/landing/` | Sits alongside `apps/app` and `apps/app-frontend` within the pnpm workspace (`apps/*`). |
| **Framework** | **Astro** (v5 / v4) | Zero JavaScript runtime by default, ideal for static landing pages. |
| **Styling** | **Tailwind CSS** | Matches the styling utility ecosystem used across the frontend packages. |
| **Icons & Media** | SVG & optimized WebP/PNG | Crisp vector graphics and low-latency asset delivery. |
| **Hosting Platform** | **Vercel** (Hobby Tier) | Free automated builds from GitHub `main` branch, free SSL, and global edge CDN. |

---

## 3. Page Structure & Components

```
apps/landing/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── screenshots/
│       └── app-preview.png
├── src/
│   ├── components/
│   │   ├── Navbar.astro           # Header navigation, logo, GitHub link & download CTA
│   │   ├── Hero.astro             # Main headline, value prop, download button, badges
│   │   ├── Showcase.astro         # Floating 3D mock / high-res screenshot of launcher
│   │   ├── Features.astro         # 6 core feature cards with icon illustrations
│   │   ├── SmartScreenGuide.astro # Helpful notice explaining Windows "Run anyway" prompt
│   │   ├── FAQ.astro              # Frequently asked questions accordion/cards
│   │   └── Footer.astro           # Links, license (GPL-3.0), and copyright
│   ├── layouts/
│   │   └── Layout.astro           # HTML skeleton, meta tags, OpenGraph, font imports
│   └── pages/
│       └── index.astro            # Main page assembling all components
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 4. Detailed Component Specifications

### 4.1 Navbar (`Navbar.astro`)
- **Logo:** `🐂 Minotaur` with version badge (`v1.0.0`).
- **Navigation Links:** Features, Screenshots, FAQ, GitHub.
- **Action:** Compact green button `Download` (scrolls to download or downloads directly).

### 4.2 Hero (`Hero.astro`)
- **Headline:** *The Fast, Privacy-First Minecraft Launcher.*
- **Subheadline:** *Play your way with offline and Microsoft accounts, built-in 3D skin customizer, automated modpack management, and zero telemetry.*
- **Primary CTA:**
  - Label: `Download for Windows`
  - Subtext: `64-bit .exe • ~54 MB • Windows 10/11`
  - Link: `https://github.com/alvyn16/Minotaur/releases/latest/download/MinotaurLauncher.exe` (with fallback to `https://github.com/alvyn16/Minotaur/releases`)
- **Secondary CTA:**
  - Label: `View on GitHub`
  - Link: `https://github.com/alvyn16/Minotaur`
- **Trust Badges:**
  - `Free & Open Source (GPL-3.0)`
  - `Zero Ads & Telemetry`
  - `Automated Java Setup`

### 4.3 Showcase (`Showcase.astro`)
- Displays an elevated, dark-mode perspective preview of the Minotaur desktop interface.
- Highlights the 3D skin viewer and offline account cards.

### 4.4 Features Grid (`Features.astro`)
Six high-contrast cards highlighting Minotaur's unique features:
1. **Offline & Microsoft Accounts:** Play on cracked/offline servers or official Mojang servers with custom usernames.
2. **3D Skin Customizer:** Select built-in default skins (Steve, Alex, Ari, etc.) or drag-and-drop custom textures with real-time 3D preview.
3. **Blazing Native Speed:** Powered by Rust and Tauri—starts in milliseconds with minimal system RAM footprint.
4. **1-Click Modpacks & Mods:** Browse, install, and update Fabric, Forge, NeoForge, and Quilt mods with automated dependency resolution.
5. **Automated Java Management:** Automatically detects and downloads the required OpenJDK version for each Minecraft instance.
6. **100% Private & Open:** Stripped of tracking analytics, Sentry logging, and third-party ads.

### 4.5 SmartScreen Guide (`SmartScreenGuide.astro`)
- Solves the common user friction with unsigned community builds on Windows.
- Explains the two clicks: **More info** $\rightarrow$ **Run anyway**.

### 4.6 FAQ (`FAQ.astro`)
- **Is Minotaur Launcher free?** Yes, completely free and open-source under GPL-3.0.
- **Can I play without a Microsoft account?** Yes, Minotaur has native offline account support for offline play and community servers.
- **Do I need to install Java?** No, Minotaur automatically provisions the correct Java runtime for every instance.
- **Can I use my existing modpacks?** Yes, you can import or browse CurseForge and Modrinth compatible modpacks directly.

### 4.7 Footer (`Footer.astro`)
- Project links: GitHub repository, issues, releases.
- Open-source attribution and license.

---

## 5. Vercel Deployment Setup

- **Project Root in Vercel:** `apps/landing`
- **Build Command:** `pnpm build` (or Astro default)
- **Output Directory:** `dist`
- **Node.js Version:** 20.x or 22.x
- **Custom Domain:** Optional (e.g. `minotaurlauncher.com` or free `minotaur-launcher.vercel.app`).

---

## 6. Monorepo Scripts

In root `package.json`:
- `"landing:dev"`: `"pnpm --filter @minotaur/landing dev"`
- `"landing:build"`: `"pnpm --filter @minotaur/landing build"`
- `"landing:preview"`: `"pnpm --filter @minotaur/landing preview"`
