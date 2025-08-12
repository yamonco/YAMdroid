
<script lang="ts">
  import { onMount } from 'svelte';
  import ScrcpySessionList from '../organisms/ScrcpySessionList.svelte';
  import { refreshSessions, setSessionForeground, killSession } from '$lib/features/scrcpy/scrcpy.actions';
  import type { ScrcpySession } from '$lib/features/scrcpy/scrcpy.types';

  // 페이지 단위에서 필요한 props/state만 관리
  export let scrcpyFolders: string[] = [];
  export let selected: string = '';
  export let loading: boolean = false;
  export let onSelectFolder: (folder: string) => void;

  let sessions: ScrcpySession[] = [];

  async function loadSessions() {
    sessions = await refreshSessions();
  }

  onMount(() => {
    loadSessions();
    // 세션 변경 이벤트 리스너 등록 (실시간 반영)
    if (window.scrcpyLog && window.scrcpyLog.on) {
      window.scrcpyLog.on(() => loadSessions());
    }
    if (window.bridge && window.bridge.onScrcpySessionUpdate) {
      window.bridge.onScrcpySessionUpdate(() => loadSessions());
    }
  });

  async function handleToggleForeground(session: ScrcpySession) {
    await setSessionForeground(session, !session.foreground);
    await loadSessions();
  }
  async function handleKill(session: ScrcpySession) {
    await killSession(session);
    await loadSessions();
  }
</script>


<div class="rounded-xl shadow p-5 mb-4">
  <h2 class="text-lg font-bold mb-3">SCRCPY 폴더 선택</h2>
  <label for="scrcpy-folder-select" class="block mb-2 font-medium">SCRCPY 버전 폴더 선택</label>
  {#if loading}
  {:else if scrcpyFolders.length === 0}
    <div class="mb-4 text-red-400 text-center">
      SCRCPY 폴더가 없습니다.<br>
      <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
      <pre class="rounded p-3 mt-2 text-xs text-left select-text">
resources/
  scrcpy/
    scrcpy-win64-v3.3/
      scrcpy.exe
      adb.exe
      ...
      </pre>
      <span>scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
    </div>
  {:else}
    <select id="scrcpy-folder-select" class="select select-bordered w-full" bind:value={selected} on:change={(e) => { if (e.target) onSelectFolder((e.target as HTMLSelectElement).value); }}>
      <option value="" disabled selected>폴더 선택...</option>
      {#each scrcpyFolders as folder}
        <option value={folder}>{folder}</option>
      {/each}
    </select>
    {#if selected}
      <div class="mt-2 text-green-400 text-sm">선택된 경로: <span class="font-mono">{selected}</span></div>
    {/if}
  {/if}
</div>

<ScrcpySessionList
  {sessions}
  onToggleForeground={handleToggleForeground}
  onKill={handleKill}
/>
