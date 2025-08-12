To handle the recent Svelte unexpected closing tag issue in a maintainable way while keeping the guidelines intact, here’s the updated recommendation:

### Additional Guideline: Svelte Template Safety

1. **Avoid Nested Block Misalignment** – Always ensure `{#if}` and `{/if}` blocks are properly nested and closed in the correct order. Svelte’s compiler will throw `Unexpected block closing tag` errors if tags are misaligned.
2. **Prefer Smaller Template Segments** – For complex conditional UIs, split them into smaller subcomponents (atoms/molecules) instead of deeply nested conditions.
3. **Remove Duplicate Closures** – Ensure there are no redundant `{/if}` statements left after refactoring.
4. **Use Prettier or ESLint Plugins** – Enforce automatic formatting that catches block mismatches before commit.

By integrating these safeguards, developers can avoid runtime and compile-time template errors while adhering to Atomic Design principles and maintaining clean Svelte 5 code.

---

## Svelte Template Block Integrity (Compile Error Bypass)

> Goal: eliminate `Unexpected block closing tag` and similar parser errors.

### Hard Rules (enforced)

1. **One block, one closer**: Each `{#if ...}{:else if ...}{:else} ... {/if}` must be a **single, contiguous** structure. No duplicated `{/if}`.
2. **No stray text** between blocks: Do not place raw text (e.g., directory trees) directly in the template. Wrap in `<pre>` or `<div>`.
3. **Do not duplicate branches**: Do not re-render the same `<select>` or component in two branches; factor once outside if both share it.
4. **Use Svelte event syntax**: `on:click`, `on:input` (not `onclick`, `oninput`).
5. **Runes only**: Template never calls state (use `selected`, not `selected()`).

### Canonical Pattern

```svelte
{#if loading}
  <div>Loading…</div>
{:else if scrcpyFolders.length === 0}
  <div>
    <span>Create folders as:</span>
    <pre>resources/
scrcpy/
scrcpy-win64-v3.3/
  scrcpy.exe</pre>
  </div>
{:else}
  <select bind:value={selected}>
    <option value="" disabled selected>Select…</option>
    {#each scrcpyFolders as folder}
      <option value={folder}>{folder}</option>
    {/each}
  </select>
  {#if selected}
    <div class="mt-2">Selected: {selected}</div>
  {/if}
{/if}

<!-- Components placed *after* the block -->
<ScrcpySessionList
  sessions={scrcpySessions}
  onForeground={(s) => setSessionForeground(s, true)}
  onBackground={(s) => setSessionForeground(s, false)}
  onKill={killSession}
/>
```

### Lint/Guard (optional but recommended)

- **Pre-commit**: run `svelte-check` to catch template block mismatches.
- **ESLint**: enable `plugin:svelte/recommended` and forbid `window.bridge` in `components/**` via `no-restricted-imports`.

> Apply these rules when editing conditional UI to avoid the just-seen parser error without altering runtime behavior.
