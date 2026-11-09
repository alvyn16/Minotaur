<div align="center">

# 🐂 Minotaur Launcher

**A fast, lightweight, and modern open-source Minecraft launcher.**  
Built with [Tauri v2](https://tauri.app/) (Rust) and [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/).

[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-1bd96a.svg?style=for-the-badge)](COPYING.md)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-1bd96a.svg?style=for-the-badge)](#)
[![GitHub stars](https://img.shields.io/github/stars/alvyn16/Minotaur?color=1bd96a&style=for-the-badge)](https://github.com/alvyn16/Minotaur/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/alvyn16/Minotaur?color=1bd96a&style=for-the-badge)](https://github.com/alvyn16/Minotaur/issues)

[Download](#download--installation) • [Features](#key-features) • [Building from Source](#building-from-source) • [Architecture](#architecture)

</div>

---

## Key Features

- **Blazing Fast Performance:** Powered by a native Rust backend and an optimized Vue 3 frontend, Minotaur starts in milliseconds and consumes minimal system resources.
- **Offline & Microsoft Accounts:** Play seamlessly with full support for Microsoft authentication **or** offline mode (custom usernames and UUID generation) without requiring third-party hosting dependencies.
- **Custom Skin Selector:** Built-in 3D skin viewer with quick selection of default skins (Steve, Alex, Ari, etc.) and support for offline skin configurations.
- **Comprehensive Mod & Pack Management:** Browse, install, and update mods, modpacks, resource packs, and shader packs across Fabric, Forge, NeoForge, and Quilt with automated dependency resolution.
- **Automated Java Management:** Automatically downloads and sets up the exact OpenJDK runtime required for each Minecraft version—no manual Java configuration needed.
- **Privacy-Focused:** Stripped of tracking analytics, telemetry, and proprietary ads.
- **Independent & Custom:** Auto-updater decoupled from official Modrinth servers to ensure your personalized setup and fork modifications remain intact.

---

## Download & Installation

### Windows
1. Download the latest `MinotaurLauncher.exe` from the [Releases](https://github.com/alvyn16/Minotaur/releases) page.
2. Place `MinotaurLauncher.exe` in any folder of your choice and run it.

> [!NOTE]
> **Windows SmartScreen Notice:**  
> Because Minotaur is a community-driven open-source project without a costly commercial code-signing certificate, Windows Defender SmartScreen may display a prompt (*"Windows protected your PC"*).  
> To run the launcher, click **More info** $\rightarrow$ **Run anyway**.

---

## Building from Source

### Prerequisites
- **Node.js:** v20.x or v22.x LTS ([nodejs.org](https://nodejs.org/))
- **pnpm:** v9.x or higher (`corepack enable` or `npm install -g pnpm`)
- **Rust & Cargo:** Stable 1.85+ ([rustup.rs](https://rustup.rs/))
- **Build Tools:**
  - **Windows:** Visual Studio 2022 C++ Build Tools (`MSVC x64`) and WebView2 Runtime
  - **Linux:** `build-essential`, `libwebkit2gtk-4.1-dev`, `libssl-dev`, `libgtk-3-dev`
  - **macOS:** Xcode Command Line Tools

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alvyn16/Minotaur.git
   cd Minotaur
   ```

2. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

3. **Build the frontend:**
   ```bash
   pnpm --filter @modrinth/app-frontend build
   ```

4. **Build the launcher (Release mode):**
   ```bash
   cargo build --release --package theseus_gui
   ```

The compiled executable will be located at `target/release/theseus_gui.exe` (or `target/release-with-thin-lto/theseus_gui.exe`).

### Development Mode
To run the launcher with live hot-reloading:
```bash
pnpm app:dev
```

To run the landing page website locally:
```bash
pnpm landing:dev
```

To build the landing page for production (Vercel):
```bash
pnpm landing:build
```

---

## Architecture

| Directory | Description |
|---|---|
| `apps/landing` | Official landing page website (Astro v5 + Tailwind CSS, hosted on Vercel) |
| `apps/app` | Tauri v2 desktop application shell & native window management (Rust) |
| `apps/app-frontend` | Launcher desktop UI built with Vue 3, Pinia, and Tailwind CSS |
| `packages/app-lib` | Core game management engine: instance lifecycle, mod loading, file integrity, and auth |
| `packages/ui` | Shared component library |
| `packages/assets` | Brand icons, stylesheets, and visual assets |

---

## License

Minotaur Launcher is free and open-source software licensed under the **GNU General Public License v3.0** ([GPL-3.0](COPYING.md)).
