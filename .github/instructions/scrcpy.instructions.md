# Atomic 패턴 + features/명령어셋 분리 가이드 (Svelte 5 Runes/함수바인딩)

> 목적: **UI(Atomic)와 도메인 로직(features/명령어셋)를 완전 분리**하여 유지보수성/테스트 용이성 확보. Svelte 5 **룬즈(\$state)** + **함수 바인딩**을 기본 규칙으로 채택.

---

## 1) 디렉터리 표준

```
src/
  components/                 # Atomic UI (UI만)
    atoms/
    molecules/
    organisms/
    templates/
    pages/

  lib/
    features/                 # 도메인별 명령어셋(백엔드성 로직)
      scrcpy/
        scrcpy.types.ts       # 타입 정의 (입출력/DTO)
        scrcpy.client.ts      # 브리지/IO 어댑터(window.bridge, fetch 등)
        scrcpy.actions.ts     # 순수 명령(API 호출/비즈 로직/검증)
        scrcpy.selectors.ts   # 파생 계산/필터(선택적)
        index.ts              # public API export만
      profiles/
        profiles.types.ts
        profiles.repo.ts      # 저장/로드(파일/스토리지)
        profiles.actions.ts
        index.ts
```

- **components/**: DOM·스타일·상호작용(토글 등)만. **백엔드성 로직 금지**.
- **lib/features/**: 도메인 로직/외부 IO/검증/정책. **Svelte 의존성 없음**.
- **window\.bridge** 등 플랫폼 의존은 **client.ts**에만 격리.

---

## 2) 역할 경계(강제)

- **UI(Atomic)**
  - 상태: `let x = $state(...)` (룬즈)
  - 이벤트: `onclick`/`oninput` (DOM), 컴포넌트 이벤트는 콜백 prop
  - 바인딩: `bind:`는 **state/prop 또는 함수 바인딩**만
  - 호출: features의 **actions**만 호출(직접 IO 금지)

- **features(명령어셋)**
  - 순수 함수·타입·검증/예외 처리·IO 어댑터 호출
  - 반환: `Result` 패턴 권장 `{ success: boolean; data?: T; error?: string }`
  - 테스트: vitest로 단위 테스트 용이

---

## 3) Svelte 5 상태/바인딩 규칙

- **상태 선언(룬즈)**

  ```svelte
  <script>
    let selected = $state("");
    let showConsole = $state(false);
  </script>
  ```

- **DOM 이벤트**: `onclick`, `oninput`
- **함수 바인딩** (계산 경로/전·후처리/검증):

  ```svelte
  <input bind:value={() => profiles[active].device, (v) => (profiles[active].device = v.trim())} />
  ```

- **로그**: `$state.snapshot(x)` 또는 `$inspect(x)`

---

## 4) features: 명령어셋 설계 규칙

### 4.1 타입/DTO

```ts
// scrcpy.types.ts
export type ScrcpySession = { id: string; foreground: boolean; pid?: number };
export type RunScrcpyArgs = { folder: string; device: string; resolution: string; dpi: string };
export type Result<T = void> = { success: true; data: T } | { success: false; error: string };
```

### 4.2 어댑터 분리

```ts
// scrcpy.client.ts (Electron/브리지 의존 격리)
export const scrcpyClient = {
  async run(args: RunScrcpyArgs) {
    return window.bridge.runScrcpy(args);
  },
  async killAdb() {
    return window.bridge.killScrcpyAdb();
  },
  async loadFolders() {
    return window.bridge.loadFolders();
  },
  onSessionUpdate(cb: (msg: any) => void) {
    window.bridge.onScrcpySessionUpdate(cb);
  },
};
```

### 4.3 명령어(actions)

```ts
// scrcpy.actions.ts
import { scrcpyClient } from "./scrcpy.client";
import type { RunScrcpyArgs, Result, ScrcpySession } from "./scrcpy.types";

export async function runScrcpy(args: RunScrcpyArgs): Promise<Result> {
  try {
    const r = await scrcpyClient.run(args);
    return r?.success ? { success: true } : { success: false, error: r?.error ?? "SCRCPY 실패" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function killScrcpyAdb(): Promise<Result> {
  try {
    await scrcpyClient.killAdb();
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function loadFolders(): Promise<string[]> {
  return scrcpyClient.loadFolders();
}

export function listenSessions(onUpdate: (s: ScrcpySession[]) => void) {
  // 필요 시 버퍼링/리듀싱 로직 추가
  scrcpyClient.onSessionUpdate(onUpdate as any);
}
```

> **원칙**: UI는 actions만 호출. `window.bridge`/fetch 등은 **client.ts**에서만.

---

## 5) UI(Atomic) 예시 — organisms/MainHome.svelte

```svelte
<script lang="ts">
  import ScrcpySessionList from "@/components/organisms/ScrcpySessionList.svelte";
  import {
    runScrcpy,
    killScrcpyAdb,
    loadFolders,
    listenSessions,
  } from "@/lib/features/scrcpy/scrcpy.actions";
  import type { ScrcpySession } from "@/lib/features/scrcpy/scrcpy.types";

  let folders = $state<string[]>([]);
  let loading = $state(false);
  let selected = $state("");

  let sessions = $state<ScrcpySession[]>([]);
  let running = $state(false);
  let killRunning = $state(false);
  let runError = $state("");

  $effect(async () => {
    if (folders.length === 0 && !loading) {
      loading = true;
      folders = await loadFolders();
      loading = false;
    }
  });

  $effect(() => {
    listenSessions((next) => {
      sessions = next;
    });
  });

  async function onRun() {
    if (!selected) return;
    running = true;
    runError = "";
    const res = await runScrcpy({
      folder: selected,
      device: profile.device,
      resolution: profile.resolution,
      dpi: profile.dpi,
    });
    if (!res.success) runError = res.error;
    running = false;
  }

  async function onKill() {
    killRunning = true;
    const res = await killScrcpyAdb();
    if (!res.success) runError = res.error;
    killRunning = false;
  }

  // 프로필 편집(함수 바인딩)
  type Profile = { device: string; resolution: string; dpi: string };
  let profile = $state<Profile>({ device: "", resolution: "", dpi: "" });
</script>

{#if loading}
  <div>Loading…</div>
{:else if folders.length === 0}
  <div>
    <span>Create folders as:</span>
    <pre>resources/\nscrcpy/\nscrcpy-win64-v3.3/\n  scrcpy.exe</pre>
  </div>
{:else}
  <select bind:value={selected}>
    <option value="" disabled selected>Select…</option>
    {#each folders as f}<option value={f}>{f}</option>{/each}
  </select>

  {#if selected}
    <section>
      <input bind:value={() => profile.device, (v) => (profile.device = v)} />
      <input bind:value={() => profile.resolution, (v) => (profile.resolution = v)} />
      <input bind:value={() => profile.dpi, (v) => (profile.dpi = v)} />
    </section>
  {/if}
{/if}

<ScrcpySessionList
  {sessions}
  onForeground={(s) => {
    /* UI-only 조작 or actions 호출 */
  }}
  onBackground={(s) => {
    /* ... */
  }}
  onKill={(s) => onKill()}
/>

<div class="actions">
  <button onclick={onRun} disabled={!selected || running}
    >{running ? "실행 중…" : "SCRCPY 실행"}</button
  >
  <button onclick={onKill} disabled={killRunning}
    >{killRunning ? "종료 중…" : "SCRCPY/ADB 강제종료"}</button
  >
</div>
```

---

## 6) 금지/권장 목록

**금지**

- components 내부에서 `window.bridge`/fetch/DB 직접 호출
- 동일 UI를 if-분기에서 중복 렌더
- `bind:`에 상태/prop/함수바인딩이 아닌 임의 표현식 사용

**권장**

- features의 actions는 순수 함수로 유지 + Result 패턴
- IO 의존성은 client.ts에 격리
- 입력 필드의 깊은 경로 수정은 함수 바인딩
- 공통부(리스트/버튼 그룹 등)는 분기 밖으로 승격

---

## 7) 테스트/품질 레일

- **단위 테스트**: features/actions를 vitest로 테스트
- **svelte-check**: 템플릿 블록/속성 오류 사전 검출
- **ESLint**: `plugin:svelte/recommended` + no-restricted-imports(`components/**` → window\.bridge 금지)
- **Prettier**: 포맷 고정으로 블록 무결성 유지

---

## 8) 마이그레이션 체크리스트

- [ ] components의 비-UI 로직을 features로 이동
- [ ] window\.bridge 접근을 전부 `*.client.ts`로 집약
- [ ] UI 입력의 중첩 경로를 함수 바인딩으로 승격
- [ ] on: 클릭/인풋 문법 제거 → onclick/oninput
- [ ] 콘솔 로그는 `$state.snapshot`/`$inspect`로 대체

---

## 9) 네이밍 규칙(명령어셋)

- **동사 기반**: `refreshSessions`, `setSessionForeground`, `killScrcpyAdb`, `loadFolders`
- **Args/DTO**: `RunScrcpyArgs`, `SaveProfileArgs` 등 명확히
- **파일 접미사**: `*.types.ts`, `*.client.ts`, `*.actions.ts`, `*.selectors.ts`

> 위 규칙을 기본 계약으로 고정. 신규 컴포넌트/기능 추가 시, 반드시 본 문서 기준을 통과해야 머지 허용.
