# Minotaur Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-converting, blazing fast Astro + Tailwind CSS landing page for Minotaur Launcher in `apps/landing` ready for free Vercel deployment.

**Architecture:** A static edge-rendered Astro site with modular components (Navbar, Hero, Showcase, Features, SmartScreenGuide, FAQ, Footer) styled with Tailwind CSS in the Minotaur dark & emerald green palette (`#1bd96a`).

**Tech Stack:** Astro 5 / 4, Tailwind CSS, TypeScript, pnpm workspace.

**Spec:** [`docs/superpowers/specs/2026-11-09-minotaur-landing-page-design.md`](docs/superpowers/specs/2026-11-09-minotaur-landing-page-design.md)

## Global Constraints
- Target workspace directory: `apps/landing/`
- Brand colors: Background `#0e1317` / `#141a20`, Emerald Green `#1bd96a`
- Single emoji rule: Only `🐂` is permitted in the title/logo; no other emojis in body or headings
- Download button target: `https://github.com/alvyn16/Minotaur/releases/latest/download/MinotaurLauncher.exe` with fallback to `https://github.com/alvyn16/Minotaur/releases`
- Must build cleanly with zero build errors via `pnpm --filter @minotaur/landing build`

## Review Focus
1. Mobile and desktop responsiveness across all viewport sizes
2. Clear contrast between text and dark background (WCAG AA compliance)
3. Download button URL points accurately to GitHub release binary
4. Zero hydration JavaScript shipped for purely static presentation
5. Vercel deployment compatibility (`dist/` build output)

---

### Task 1: Scaffold `apps/landing` Project Configuration

**Files:**
- Create: `apps/landing/package.json`
- Create: `apps/landing/astro.config.mjs`
- Create: `apps/landing/tailwind.config.mjs`
- Create: `apps/landing/tsconfig.json`
- Modify: `package.json` (root)

- [ ] **Step 1: Create `apps/landing/package.json`**
  Define `@minotaur/landing`, dependencies on `astro` and `@astrojs/tailwind`, `tailwindcss`, and build scripts.
- [ ] **Step 2: Create `astro.config.mjs` and `tailwind.config.mjs`**
  Configure Astro with Tailwind integration and custom color palette (`minotaur: '#1bd96a'`).
- [ ] **Step 3: Create `tsconfig.json`**
  Extend `astro/tsconfigs/strict`.
- [ ] **Step 4: Update root `package.json`**
  Add scripts `"landing:dev"` and `"landing:build"`.
- [ ] **Step 5: Run `pnpm install`**
  Verify dependencies link cleanly in pnpm workspace.
- [ ] **Step 6: Commit changes**
  `git commit -m "chore(landing): scaffold Astro and Tailwind project structure"`

---

### Task 2: Layout & Global Styles

**Files:**
- Create: `apps/landing/src/layouts/Layout.astro`
- Create: `apps/landing/src/styles/global.css`
- Create: `apps/landing/public/favicon.svg`

- [ ] **Step 1: Create `global.css`**
  Add Tailwind directives and smooth-scroll behavior.
- [ ] **Step 2: Create `favicon.svg`**
  Add branded Minotaur emerald green icon.
- [ ] **Step 3: Create `Layout.astro`**
  Set up HTML document shell, meta tags, OpenGraph previews, and font styling.
- [ ] **Step 4: Verify layout**
  Ensure HTML renders without errors.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(landing): create base layout, meta tags, and global styles"`

---

### Task 3: Navbar & Footer Components

**Files:**
- Create: `apps/landing/src/components/Navbar.astro`
- Create: `apps/landing/src/components/Footer.astro`

- [ ] **Step 1: Implement `Navbar.astro`**
  Add `🐂 Minotaur` brand logo with version badge, section anchor links (Features, Screenshots, FAQ), GitHub repository link, and a header "Download" button.
- [ ] **Step 2: Implement `Footer.astro`**
  Add project links, GPL-3.0 license note, and GitHub repository links.
- [ ] **Step 3: Test rendering**
  Ensure navigation links and responsive hamburger/desktop menus display cleanly.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(landing): implement Navbar and Footer components"`

---

### Task 4: Hero Section

**Files:**
- Create: `apps/landing/src/components/Hero.astro`

- [ ] **Step 1: Implement `Hero.astro`**
  - Add headline: "The Fast, Privacy-First Minecraft Launcher."
  - Add subheading highlighting offline play, 3D skins, modpack management, and zero telemetry.
  - Add primary CTA button "Download for Windows" (`.exe • ~54 MB • Windows 10/11`) linking to release binary.
  - Add secondary CTA button "View on GitHub".
  - Add trust badges: Free & Open Source (GPL-3.0), Zero Ads, Java Included.
- [ ] **Step 2: Verify CTA links and responsive layout**
  Check button responsiveness and click targets.
- [ ] **Step 3: Commit changes**
  `git commit -m "feat(landing): implement high-converting Hero component"`

---

### Task 5: App Showcase & Visual Preview

**Files:**
- Create: `apps/landing/src/components/Showcase.astro`
- Create/copy screenshot assets to: `apps/landing/public/screenshots/`

- [ ] **Step 1: Prepare launcher screenshot**
  Export a crisp visual of the Minotaur Launcher window showing the 3D skin editor and offline account selector.
- [ ] **Step 2: Implement `Showcase.astro`**
  Create an elevated, high-contrast mockup container with subtle emerald glow border and realistic window controls.
- [ ] **Step 3: Verify visual rendering**
  Confirm the image scales cleanly on mobile and desktop displays.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(landing): implement Showcase component with launcher mockup"`

---

### Task 6: Core Features Grid

**Files:**
- Create: `apps/landing/src/components/Features.astro`

- [ ] **Step 1: Implement `Features.astro`**
  Build 6 feature cards:
  1. Offline & Microsoft Accounts
  2. 3D Skin Customizer
  3. Blazing Native Speed (Rust + Tauri)
  4. 1-Click Modpacks & Mods (Fabric, Forge, NeoForge, Quilt)
  5. Automated Java Management (OpenJDK auto-provisioning)
  6. 100% Private (Zero tracking, Sentry, or telemetry)
- [ ] **Step 2: Style cards**
  Add subtle hover transitions and emerald accent borders.
- [ ] **Step 3: Commit changes**
  `git commit -m "feat(landing): implement Features grid component"`

---

### Task 7: SmartScreen Guide & FAQ Components

**Files:**
- Create: `apps/landing/src/components/SmartScreenGuide.astro`
- Create: `apps/landing/src/components/FAQ.astro`

- [ ] **Step 1: Implement `SmartScreenGuide.astro`**
  Explain the two clicks needed for unsigned open-source Windows binaries: "More info" -> "Run anyway".
- [ ] **Step 2: Implement `FAQ.astro`**
  Accordion answering: Is Minotaur Launcher free? Can I play without a Microsoft account? Do I need to install Java? How do I install mods?
- [ ] **Step 3: Test FAQ interaction**
  Ensure questions and answers render clearly.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(landing): implement SmartScreen guide and FAQ components"`

---

### Task 8: Assemble Page & Verify Vercel Build

**Files:**
- Create: `apps/landing/src/pages/index.astro`
- Create: `apps/landing/vercel.json`

- [ ] **Step 1: Implement `apps/landing/src/pages/index.astro`**
  Assemble all components inside `Layout.astro`.
- [ ] **Step 2: Create `vercel.json`**
  Configure headers for caching and security.
- [ ] **Step 3: Run build check**
  Execute `pnpm --filter @minotaur/landing build`. Verify exit code 0 and output in `dist/`.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(landing): assemble index page and verify production build"`

---

### Task 9: Push to GitHub & Vercel Deployment Instructions

**Files:**
- Modify: `README.md` (add website link and Vercel deployment badge/instructions)

- [ ] **Step 1: Update README.md**
  Reference the website directory and deployment instructions.
- [ ] **Step 2: Push to GitHub `main`**
  `git push origin main`
- [ ] **Step 3: Provide Vercel setup instructions**
  Provide the user with the step-by-step instructions to link their repository to Vercel for free hosting.
- [ ] **Step 4: Final verification and summary**
