# Project Structure & Development Guidelines

## Directory Overview

```
/
├── package.json            # Root scripts, Electron builder, dev orchestration
├── README.md               # Project documentation and dev instructions
├── electron/               # Electron main process (TypeScript)
│   ├── app.ts              # Main Electron app logic, IPC, window management
│   ├── preload.ts          # Preload script, contextBridge for secure IPC
│   └── tsconfig.json       # TypeScript config for Electron
├── renderer/               # Frontend (Svelte, Vite, Tailwind, Atomic Design)
│   ├── src/
│   │   ├── App.svelte
│   │   ├── main.ts
│   │   ├── app.css
│   │   └── components/
│   │        ├── atoms/     # Smallest UI units (buttons, inputs, etc.)
│   │        ├── molecules/ # Composed UI (input+label, etc.)
│   │        └── organisms/ # Large UI blocks (forms, cards, etc.)
│   ├── package.json
│   └── vite.config.ts
├── resources/              # Static assets, SCRCPY binaries, profiles, etc.
└── dist/                   # Build output (auto-generated)
```

## Electron Hot Reload Principle

- The main process uses `electron-reload` in development mode.
- Any change in `electron/` TypeScript files triggers a rebuild (`tsc --watch`), which in turn triggers Electron to reload the main process.
- This ensures that IPC handlers, window logic, and backend code are always up-to-date without manual restarts.

**Key points:**

- `electron-reload` watches the compiled JS output (`dist/electron/app.js`).
- TypeScript is compiled in watch mode, so changes are reflected instantly.
- No need to manually restart Electron during development.

## Frontend (Renderer) Management

- The frontend is built with Svelte, Vite, and Tailwind CSS.
- **Atomic Design** is used for UI:
  - `atoms/` = smallest elements
  - `molecules/` = simple combinations
  - `organisms/` = complex UI blocks
- Vite dev server provides instant HMR (Hot Module Replacement) for all frontend code and styles.
- All UI/UX changes are reflected in real time in the running app.

## Development Workflow

- Run `npm run dev` at the project root.
  - This starts:
    - Vite dev server for the frontend (with HMR)
    - TypeScript in watch mode for Electron main process
    - Electron with hot-reload for backend changes
- All code changes (frontend or backend) are reflected live—no manual build or restart needed.

## Best Practices

- Keep Electron main process logic in `electron/app.ts` and expose only safe APIs via `preload.ts`.
- Organize UI components by atomic design in `renderer/src/components/`.
- Use IPC (via contextBridge) for all communication between frontend and backend.
- Store persistent data (profiles, settings) in the `resources/` directory.

---

**This structure and workflow ensure maximum development speed, safety, and maintainability for both Electron and Svelte code.**
