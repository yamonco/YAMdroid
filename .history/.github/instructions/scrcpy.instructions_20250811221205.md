# Project Architecture & Development Guide — Svelte 5 + Atomic (Concise)

> Single source of truth for structure, IPC safety, Svelte 5 runes, and SCRCPY workflow.

---

## 1) Baseline (enforced)

- **Node**: 22 LTS. **Package manager**: npm (commit `package-lock.json`).
- **Svelte**: 5.x (runes). **Vite**: 7.x + **@sveltejs/vite-plugin-svelte** 6.x.
- **CSS**: Tailwind. **Electron**: `contextIsolation: true`, `nodeIntegration: false`.
- Runes are **compiler syntax**. **Never** import `signal`/`rune`.

---

## 2) Repository layout

```
/
├─ electron/                 # Main process (TS)
│  ├─ app.ts                 # windows, IPC handlers
│  ├─ preload.ts             # contextBridge API (single entry)
│  └─ tsconfig.json
├─ renderer/
│  ├─ package.json  vite.config.ts
│  └─ src/
│     ├─ App.svelte  main.ts  app.css
│     ├─ lib/
│     │  ├─ features/
│     │  │  ├─ scrcpy/
│     │  │  │  ├─ scrcpy.types.ts
│     │  │  │  ├─ scrcpy.service.ts     # wraps window.bridge only
│     │  │  │  └─ scrcpy.actions.ts     # orchestration use-cases
│     │  ├─ types.ts  utils/
│     └─ components/ (Atomic)
│        ├─ atoms/  ├─ molecules/  └─ organisms/
├─ resources/                # static, profiles, scrcpy bins
└─ dist/                     # build output
```

**Rule:** Components never touch `window.bridge`. All side effects live in `*.service.ts` (and are called via `*.actions.ts`).

---

## 3) Layering model (what goes where)

- **Service** (`*.service.ts`): thin wrappers over `window.bridge`. The _only_ I/O exit.
- **Actions** (`*.actions.ts`): orchestrate services, shape results, apply domain rules. Pure functions (no runes).
- **UI** (Atomic components/pages): runes-only state, call actions via props/imports.

```ts
// renderer/src/lib/features/scrcpy/scrcpy.service.ts
export const scrcpyService = {
  list: () => window.bridge.listScrcpySessions(),
  setForeground: (title: string, fg: boolean) => window.bridge.setScrcpyForeground(title, fg),
  kill: (pid: number) => window.bridge.killScrcpySession(pid),
  scanFolders: () => window.bridge.scanScrcpyFolders(),
  saveProfiles: (p: any[]) => window.bridge.saveProfiles(p),
} as const;

// renderer/src/lib/features/scrcpy/scrcpy.actions.ts
import { scrcpyService as S } from "./scrcpy.service";
import type { ScrcpySession } from "./scrcpy.types";
export const refreshSessions = async () =>
  (await S.list()).sort((a, b) => +b.foreground - +a.foreground);
export const setSessionForeground = (s: ScrcpySession, fg: boolean) =>
  S.setForeground(`SCRCPY_${s.device}`, fg);
```

---

## 4) Svelte 5 runes (do it this way)

- **State:** `let x = $state(0)`
- **Derived:** `const y = $derived(x * 2)`
- **Effect:** `$effect(() => { ... })`
- **Template:** never call state (`x`, not `x()`). No HTML comments in templates.

```svelte
<script lang="ts">
  import { refreshSessions, setSessionForeground } from "$lib/features/scrcpy/scrcpy.actions";
  import type { ScrcpySession } from "$lib/features/scrcpy/scrcpy.types";

  let sessions: ScrcpySession[] = $state([]);
  let loading = $state(false);
  let error: string | null = $state(null);

  async function load() {
    loading = true;
    error = null;
    try {
      sessions = await refreshSessions();
    } catch (e) {
      error = String(e);
    } finally {
      loading = false;
    }
  }
  $effect(() => {
    if (!sessions.length && !loading) load();
  });
</script>
```

---

## 5) IPC contract & typing (single source of truth)

```ts
// renderer/src/lib/types.ts
export type ScrcpySession = {
  id: string;
  pid: number;
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
  foreground: boolean;
};
export type SaveProfilesResult = { success: boolean; error?: string };
```

```ts
// electron/preload.ts (excerpt)
import { contextBridge, ipcRenderer } from "electron";
const api = {
  listScrcpySessions: () => ipcRenderer.invoke("scrcpy:list"),
  setScrcpyForeground: (title: string, fg: boolean) =>
    ipcRenderer.invoke("scrcpy:foreground", { title, fg }),
  killScrcpySession: (pid: number) => ipcRenderer.invoke("scrcpy:kill", { pid }),
  scanScrcpyFolders: () => ipcRenderer.invoke("scrcpy:scan-folders"),
  saveProfiles: (profiles: any[]) => ipcRenderer.invoke("profiles:save", { profiles }),
  onScrcpySessionUpdate: (cb: (e: any) => void) => ipcRenderer.on("scrcpy:update", (_, e) => cb(e)),
};
contextBridge.exposeInMainWorld("bridge", api);
```

```ts
// renderer/src/global.d.ts
import type { ScrcpySession, SaveProfilesResult } from "./lib/types";
export {};
declare global {
  interface Window {
    bridge: {
      setScrcpyForeground: (title: string, fg: boolean) => Promise<void>;
      listScrcpySessions: () => Promise<ScrcpySession[]>;
      killScrcpySession: (pid: number) => Promise<void>;
      scanScrcpyFolders: () => Promise<string[]>;
      saveProfiles: (profiles: any[]) => Promise<SaveProfilesResult>;
      onScrcpySessionUpdate: (cb: (msg: any) => void) => void;
    };
  }
}
```

---

## 6) Atomic workflow (procedural)

1. Build **Atoms** → compose **Molecules** → assemble **Organisms** → place on **Pages**.
2. Promotion rules:
   - Atom→Molecule when reused together in ≥2 places.
   - Molecule→Organism when it owns domain state (loading/empty/error) and emits events.

3. Props must be nouns with defaults. Events use imperative names (`onSaveClick`).

---

## 7) Do / Don’t

**Do**

- Keep side effects in Services; orchestrate in Actions; use runes in UI.
- Use domain prefixes for IPC channels: `scrcpy:*`, `profiles:*`.
- Enforce ESLint `no-restricted-imports` to block `window.bridge` in `components/`.

**Don’t**

- Import `signal`/`rune`.
- Call `window.bridge` from components.
- Leave HTML comments in Svelte templates.

---

## 8) PR checklist

- [ ] Runes only (no call-style state)
- [ ] Uses Service/Action layering (components don’t touch bridge)
- [ ] Atomic promotion rules respected
- [ ] Types/IPC updated first, then usage
- [ ] `svelte-check`, `tsc`, `eslint` pass

---

## 9) Scripts (root idea)

```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:renderer\" \"npm:dev:electron\"",
    "dev:renderer": "npm --prefix renderer run dev",
    "dev:electron": "tsc -p electron/ -w",
    "build": "npm -w renderer run build && tsc -p electron/",
    "lint": "eslint \"renderer/src/**/*.{ts,svelte}\"",
    "check": "svelte-check --tsconfig renderer/tsconfig.json",
    "doctor": "npm run check && npm run lint"
  }
}
```
