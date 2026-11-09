# Minotaur Launcher (Desktop Shell)

The desktop shell of Minotaur Launcher, built with [Tauri v2](https://tauri.app/) and [Vue 3](https://vuejs.org/).

## Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

### Running in Development
```bash
pnpm install
pnpm app:dev
```

### Compiling Release
```bash
pnpm --filter @modrinth/app-frontend build
cargo build --release --package theseus_gui
```
