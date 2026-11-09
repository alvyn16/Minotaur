# Minotaur Launcher Design Specification

> Privacy-focused, independent fork of the Modrinth App with offline account support and independent branding.

## 1. Overview & Goals

**Minotaur Launcher** is an open-source, privacy-first desktop Minecraft launcher forked from the Modrinth App (`apps/app`, `apps/app-frontend`, `packages/app-lib`, and supporting shared libraries).

### Core Goals
1. **Full Brand Independence & License Compliance**:
   - Strip all proprietary Modrinth branding (logos, wordmarks, Rinthbot mascot, and restrictive assets) in strict accordance with Modrinth's `COPYING.md` guidelines.
   - Adopt the independent **Minotaur Launcher** identity with custom SVG and raster assets.
   - Retain full GNU General Public License v3 (GPLv3) compliance for source code.
2. **Offline / Cracked Account Support**:
   - Provide seamless offline account management alongside standard Microsoft authentication.
   - Implement standard Minecraft Java offline UUID generation (MD5-based UUIDv3 on `OfflinePlayer:<username>`).
   - Prevent unnecessary network calls or token refresh attempts for offline accounts.
   - UI support in the launcher's account switcher for adding, selecting, and removing offline accounts.
3. **Privacy & Security Enhancements**:
   - Eliminate third-party telemetry and error reporting (remove Sentry ingest).
   - Strip external tracking scripts (e.g. Tally embed) and clean up Tauri Content Security Policy (CSP).
   - Disable embedded advertising webviews and trackers.
   - Default telemetry to disabled.

---

## 2. Branding & Identity Replacement

### 2.1 Identity Mappings
| Property | Original (Modrinth) | Minotaur Launcher |
| :--- | :--- | :--- |
| **Product Name** | `Modrinth App` | `Minotaur Launcher` |
| **Binary Name** | `Modrinth App` / `ModrinthApp` | `Minotaur` |
| **Tauri App Identifier** | `ModrinthApp` / `com.modrinth.theseus` | `com.minotaur.launcher` |
| **Custom URL Scheme** | `modrinth://` | `minotaur://` (with fallback compatibility) |
| **Window Title** | `Modrinth App` | `Minotaur` |
| **Primary Theme Accent**| `#1bd96a` (Modrinth Green) | Minotaur Crimson / Amber / Bronze accents |

### 2.2 Asset Replacements
- **Vector Logo (`packages/assets/branding/logo.svg`)**:
  - Replace with custom SVG featuring a geometric stylized Minotaur / labyrinth horn motif.
- **Application Icons (`apps/app/icons/`)**:
  - Replace all Windows (`Square*.png`, `icon.ico`), macOS (`icon.icns`), Linux, and web (`favicon.ico`, `128x128.png`, `128x128@2x.png`) icons with the Minotaur icon set.
- **Proprietary Mascot / Artwork (`packages/assets/branding/rinthbot/`, `illustrations/`)**:
  - Remove Rinthbot illustrations or replace with neutral placeholders.
- **Copy & Notices**:
  - Update `apps/app/COPYING.md`, `packages/assets/COPYING.md`, and root `COPYING.md` to reflect the Minotaur fork, GPLv3 license, and disclaimer of non-affiliation with Rinth, Inc. or Mojang / Microsoft.

---

## 3. Offline / Cracked Account Architecture

### 3.1 Backend Data Model (`packages/app-lib`)
- **Offline UUID Generation**:
  - Minecraft Java Edition standard offline UUID:
    ```rust
    let hash = md5::compute(format!("OfflinePlayer:{}", username).as_bytes());
    // Or UUIDv3 using MD5 over OfflinePlayer:name
    ```
- **Credentials Model (`packages/app-lib/src/state/minecraft_auth.rs`)**:
  - `access_token`: Set to `"0"` or `"offline"`.
  - `refresh_token`: Set to `"offline"`.
  - `expires`: Timestamp set far into the future (e.g., 100 years) so expiration checks never trigger.
  - `refresh()` method:
    - Add a guard:
      ```rust
      if self.refresh_token == "offline" || self.access_token == "0" {
          return Ok(());
      }
      ```
      This guarantees zero outbound HTTP requests to Microsoft/Mojang OAuth endpoints for offline accounts.
  - `online_profile()` / `maybe_online_profile()`:
    - If `refresh_token == "offline"`, return `MaybeOnlineMinecraftProfile::Offline(&self.offline_profile)` immediately without network requests.

### 3.2 Backend API (`packages/app-lib/src/api/minecraft_auth.rs`)
- Add `add_offline_user(username: String) -> crate::Result<Credentials>`:
  - Validates username (1–16 characters, alphanumeric and underscores: `^[a-zA-Z0-9_]{1,16}$`).
  - Computes offline UUID.
  - Constructs `Credentials` with `active = true`.
  - Deactivates previous active user and upserts offline user into SQLite `minecraft_users`.

### 3.3 Tauri Bridge (`apps/app/src/api/auth.rs`)
- Expose `login_offline(username: String) -> Result<Credentials>` to Tauri commands.
- Register `login_offline` in `tauri::generate_handler!`.

### 3.4 Launcher Arguments (`packages/app-lib/src/launcher/args.rs`)
- Verified: `args.rs` substitutes `${auth_player_name}`, `${auth_uuid}`, `${accessToken}`, and `${user_type}`.
- For offline accounts, passes:
  - `${auth_player_name}` = `username`
  - `${auth_uuid}` = `offline_uuid`
  - `${accessToken}` = `"0"`
  - `${auth_xuid}` = `"0"`
  - `${user_type}` = `"legacy"`

### 3.5 Frontend UI (`apps/app-frontend`)
- **Helper (`apps/app-frontend/src/helpers/auth.js`)**:
  - Add `export async function login_offline(username)` calling `invoke('plugin:auth|login_offline', { username })`.
- **Account Switcher (`apps/app-frontend/src/features/minecraft-accounts/accounts-card.vue`)**:
  - Provide an "Add Offline Account" action alongside "Sign in with Microsoft".
  - Include an intuitive input modal / prompt for offline username with validation feedback.
  - Render offline accounts cleanly with default Minecraft skins (Steve/Alex) in the account list.

---

## 4. Privacy & Security Hardening

1. **Error Reporting (`apps/app-frontend/src/helpers/error-reporting.ts`)**:
   - Remove Sentry remote initialization (`@sentry/vue` DSN).
   - Route unhandled errors strictly to the local logger / dev console.
2. **CSP & Tracking Removal (`apps/app/tauri.conf.json`, `index.html`)**:
   - Strip `https://*.sentry.io`, `https://*.intercom.io`, `https://js.stripe.com`, `https://tally.so` from CSP `connect-src` and `script-src`.
   - Remove Tally embed script from `index.html`.
3. **Ad Subsystem (`apps/app/src/api/ads.rs`)**:
   - Disable ad webview loading and cookie synchronization.
4. **Default Settings**:
   - Set `telemetry` default to `false` in `settings.rs` and database defaults.

---

## 5. Verification & Testing Strategy

1. **Branding Check**:
   - Grep for proprietary references to ensure bundle metadata, app titles, and assets are completely swapped.
2. **Offline Auth Unit & Integration Logic**:
   - Test offline UUID generation matches Minecraft Java Edition specs.
   - Verify offline account insertion into SQLite database.
   - Verify `refresh()` returns immediately without network calls.
   - Verify argument generator produces correct CLI flags for Minecraft.
3. **Build & Bundle Verification**:
   - Verify frontend builds (`pnpm turbo run build --filter=@modrinth/app-frontend`).
   - Verify Tauri builds cleanly with updated configuration.
