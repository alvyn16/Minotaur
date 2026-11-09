# Minotaur Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Modrinth App desktop client into the independent, privacy-focused Minotaur Launcher with offline Minecraft account support and complete removal of proprietary branding.

**Architecture:** Replace branding metadata and graphical assets across the Tauri and Vue packages; implement standard Java offline UUIDs and offline credential handling in the Rust backend (`packages/app-lib`); expose offline authentication through Tauri IPC to the Vue frontend account manager; harden user privacy by eliminating external Sentry, Tally, and telemetry calls.

**Tech Stack:** Rust (Tauri v2, SQLx, Tokio, md-5/uuid), TypeScript/Vue 3, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-11-08-minotaur-launcher-design.md`

## Global Constraints
- Target codebase scope: `apps/app`, `apps/app-frontend`, `packages/app-lib`, `packages/assets`.
- All code remains under the GNU General Public License v3 (GPL-3.0-only).
- Modrinth proprietary logos, wordmarks, and Rinthbot illustrations must be completely excised.
- Offline accounts must generate deterministic UUIDv3 format matching standard Java Edition `UUID.nameUUIDFromBytes(("OfflinePlayer:" + username).getBytes(StandardCharsets.UTF_8))`.
- No network requests may be initiated when refreshing or loading offline accounts.

## Review Focus
1. Offline accounts must never attempt to contact Microsoft or Mojang authentication servers.
2. Usernames with invalid characters (non-alphanumeric/underscore or length outside 1–16) must be rejected with user-friendly validation.
3. Offline player UUID calculation must be bit-for-bit identical with Minecraft Java Edition server expectations.
4. Sentry or other third-party error trackers must never be loaded in production or development.
5. Tauri window title, bundle ID, and binary names must reflect Minotaur without residual Modrinth branding.

---

### Task 1: Privacy Hardening & Telemetry Removal

**Files:**
- Modify: `apps/app-frontend/src/helpers/error-reporting.ts`
- Modify: `apps/app-frontend/index.html:14`
- Modify: `apps/app/tauri.conf.json:105-110`
- Modify: `packages/app-lib/src/state/settings.rs:160-180`

- [ ] **Step 1: Disable Sentry in `apps/app-frontend/src/helpers/error-reporting.ts`**
Replace remote Sentry initialization with local logger/console fallback so no crash data is transmitted to third parties.

- [ ] **Step 2: Strip external tracking scripts from `apps/app-frontend/index.html`**
Remove `<script src="https://tally.so/widgets/embed.js" async></script>`.

- [ ] **Step 3: Clean up Tauri CSP in `apps/app/tauri.conf.json`**
Remove `sentry.io`, `intercom.io`, `tally.so`, and `stripe.com` domains from the Content Security Policy.

- [ ] **Step 4: Default telemetry setting to disabled in `packages/app-lib/src/state/settings.rs`**
Ensure `telemetry` defaults to `false` when initializing default settings.

- [ ] **Step 5: Verify changes and commit**
```bash
git add apps/app-frontend/src/helpers/error-reporting.ts apps/app-frontend/index.html apps/app/tauri.conf.json packages/app-lib/src/state/settings.rs
git commit -m "chore(privacy): strip telemetry, sentry, and tracking scripts"
```

---

### Task 2: Branding Replacement (Configuration & Metadata)

**Files:**
- Modify: `apps/app/tauri.conf.json:58-81`
- Modify: `apps/app/tauri.linux.conf.json:2`
- Modify: `apps/app/tauri.macos.conf.json:10`
- Modify: `apps/app/Cargo.toml:6-7`
- Modify: `apps/app-frontend/index.html:7`
- Modify: `apps/app/src/api/auth.rs:51`
- Modify: `COPYING.md`
- Modify: `apps/app/COPYING.md`

- [ ] **Step 1: Update Tauri configuration files**
In `apps/app/tauri.conf.json`, `tauri.linux.conf.json`, and `tauri.macos.conf.json`:
- Set `"productName"` to `"Minotaur Launcher"`
- Set `"mainBinaryName"` to `"Minotaur"`
- Set `"identifier"` to `"com.minotaur.launcher"`
- Set window `"title"` to `"Minotaur"`

- [ ] **Step 2: Update `apps/app/Cargo.toml`**
Set package description to `"Minotaur is a privacy-focused Minecraft launcher"`.

- [ ] **Step 3: Update `apps/app-frontend/index.html`**
Set `<title>Minotaur Launcher</title>`.

- [ ] **Step 4: Update `apps/app/src/api/auth.rs`**
Change the sign-in modal window title from `"Sign into Modrinth"` to `"Sign into Minecraft"`.

- [ ] **Step 5: Update `COPYING.md` and `apps/app/COPYING.md`**
Update copy notices to describe the Minotaur fork under GPLv3 and clearly disclaim affiliation with Rinth, Inc. and Microsoft.

- [ ] **Step 6: Verify changes and commit**
```bash
git add apps/app/tauri.conf.json apps/app/tauri.linux.conf.json apps/app/tauri.macos.conf.json apps/app/Cargo.toml apps/app-frontend/index.html apps/app/src/api/auth.rs COPYING.md apps/app/COPYING.md
git commit -m "chore(branding): rebrand configuration metadata to Minotaur Launcher"
```

---

### Task 3: Visual Assets & Icon Generation

**Files:**
- Modify: `packages/assets/branding/logo.svg`
- Modify: `apps/app/icons/128x128.png`
- Modify: `apps/app/icons/128x128@2x.png`
- Modify: `apps/app/icons/icon.png`
- Modify: `apps/app/icons/favicon.ico`
- Modify: `apps/app/icons/icon.ico`

- [ ] **Step 1: Design and write custom Minotaur SVG logo**
Write a new geometric SVG vector logo in `packages/assets/branding/logo.svg` representing the Minotaur / labyrinth motif with clean lines.

- [ ] **Step 2: Generate application icons in `apps/app/icons/`**
Generate PNG and ICO assets with the new Minotaur design replacing existing proprietary Modrinth wrench-in-labyrinth icons.

- [ ] **Step 3: Neutralize/replace proprietary Rinthbot assets**
Ensure no proprietary Modrinth character art or mascot files remain.

- [ ] **Step 4: Verify and commit**
```bash
git add packages/assets/branding/ apps/app/icons/
git commit -m "feat(assets): replace Modrinth branding assets with Minotaur icon set"
```

---

### Task 4: Backend Offline Account Engine (`packages/app-lib`)

**Files:**
- Modify: `packages/app-lib/src/state/minecraft_auth.rs`
- Modify: `packages/app-lib/src/api/minecraft_auth.rs`

**Interfaces:**
- Consumes: `sqlx::Sqlite`, `uuid::Uuid`, `md5`
- Produces: `minecraft_auth::add_offline_user(username: String) -> Result<Credentials>`

- [ ] **Step 1: Implement standard Java offline UUID computation**
In `packages/app-lib/src/state/minecraft_auth.rs`:
Add helper `pub fn compute_offline_uuid(username: &str) -> Uuid`:
Compute standard Type 3 (MD5) UUID from `"OfflinePlayer:<username>"` matching Minecraft Java specification:
```rust
pub fn compute_offline_uuid(username: &str) -> Uuid {
    let mut md5_context = md5::Context::new();
    md5_context.consume(format!("OfflinePlayer:{username}").as_bytes());
    let mut digest = md5_context.compute().0;
    // Set version to 3 (MD5 based)
    digest[6] = (digest[6] & 0x0f) | 0x30;
    // Set variant to IETF variant (RFC 4122)
    digest[8] = (digest[8] & 0x3f) | 0x80;
    Uuid::from_bytes(digest)
}
```

- [ ] **Step 2: Guard `Credentials::refresh` against offline tokens**
In `packages/app-lib/src/state/minecraft_auth.rs`:
At the start of `Credentials::refresh`:
```rust
if self.refresh_token == "offline" || self.access_token == "0" {
    return Ok(());
}
```

- [ ] **Step 3: Guard `Credentials::online_profile_with_cache_intent` for offline tokens**
If `self.refresh_token == "offline"`, return `None` immediately so it falls back to `self.offline_profile` without attempting Mojang API calls.

- [ ] **Step 4: Implement `add_offline_user` in `packages/app-lib/src/api/minecraft_auth.rs`**
```rust
#[tracing::instrument]
pub async fn add_offline_user(username: String) -> crate::Result<Credentials> {
    let username = username.trim().to_string();
    if username.is_empty() || username.len() > 16 || !username.chars().all(|c| c.is_ascii_alphanumeric() || c == '_') {
        anyhow::bail!("Invalid Minecraft username: must be 1-16 characters (letters, numbers, underscores)");
    }
    let state = State::get().await?;
    let uuid = crate::state::compute_offline_uuid(&username);
    let credentials = Credentials {
        offline_profile: MinecraftProfile {
            id: uuid,
            name: username,
            ..Default::default()
        },
        access_token: "0".to_string(),
        refresh_token: "offline".to_string(),
        expires: Utc::now() + Duration::days(36500),
        active: true,
    };
    credentials.upsert(&state.pool).await?;
    Ok(credentials)
}
```

- [ ] **Step 5: Write unit tests verifying offline UUID generation and offline credential handling**
Add unit test in `packages/app-lib/src/state/minecraft_auth.rs` testing known offline player UUIDs (e.g. "Steve" -> `c06f8906-4c8a-3911-9c52-65ba9937000e`).

- [ ] **Step 6: Verify and commit**
```bash
git add packages/app-lib/src/state/minecraft_auth.rs packages/app-lib/src/api/minecraft_auth.rs
git commit -m "feat(auth): implement offline account support and standard UUID calculation"
```

---

### Task 5: Tauri Command & Frontend Integration (`apps/app` & `apps/app-frontend`)

**Files:**
- Modify: `apps/app/src/api/auth.rs`
- Modify: `apps/app-frontend/src/helpers/auth.js`
- Modify: `apps/app-frontend/src/features/minecraft-accounts/accounts-card.vue`

**Interfaces:**
- Consumes: `minecraft_auth::add_offline_user`
- Produces: `plugin:auth|login_offline` Tauri IPC command and frontend modal UI

- [ ] **Step 1: Expose `login_offline` Tauri command in `apps/app/src/api/auth.rs`**
```rust
#[tauri::command]
pub async fn login_offline(username: String) -> Result<Credentials> {
    let val = minecraft_auth::add_offline_user(username).await?;
    Ok(val)
}
```
Add `login_offline` to `tauri::generate_handler![..., login_offline]`.

- [ ] **Step 2: Add `login_offline` helper in `apps/app-frontend/src/helpers/auth.js`**
```javascript
export async function login_offline(username) {
    return await invoke('plugin:auth|login_offline', { username })
}
```

- [ ] **Step 3: Add Offline Account UI in `apps/app-frontend/src/features/minecraft-accounts/accounts-card.vue`**
- Add button "Add Offline Account" alongside "Sign in with Microsoft"
- Add clean input dialog for entering offline username with character validation
- On submit, call `login_offline(username)`, refresh accounts list, and select the new account.

- [ ] **Step 4: Verify and commit**
```bash
git add apps/app/src/api/auth.rs apps/app-frontend/src/helpers/auth.js apps/app-frontend/src/features/minecraft-accounts/accounts-card.vue
git commit -m "feat(ui): add offline account management to accounts card"
```

---

### Task 6: Final Verification & Build Check

**Files:**
- All modified files

- [ ] **Step 1: Check git diff and untracked files**
Ensure no uncommitted or unwanted files were generated.

- [ ] **Step 2: Run frontend build or linter**
Verify `@modrinth/app-frontend` compiles without errors.

- [ ] **Step 3: Verification commit & summary**
Document all completed work in the final response.
