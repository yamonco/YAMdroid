<script lang="ts">
import ProfileManager from '../organisms/ProfileManager.svelte';
import ProfileListCard from '../organisms/ProfileListCard.svelte';
import ScrcpySessionList from '../organisms/ScrcpySessionList.svelte';
import ConsoleLog from '../atoms/ConsoleLog.svelte';
import type { ScrcpySession } from '../../lib/features/scrcpy/scrcpy.types';
// 상태/이펙트/비즈니스 로직 없음. 모든 상태/이벤트는 루트에서 props로만 전달받음.
export let scrcpyFolders: string[];
export let selected: string;
export let setSelected: (v: string) => void;
export let loading: boolean;
export let profiles: any[];
export let activeProfileIdx: number;
export let newProfileName: string;
export let addProfile: () => void;
export let removeProfile: (idx: number) => void;
export let selectProfile: (idx: number) => void;
export let updateProfileField: (field: string, value: string) => void;
export let showSaved: boolean;
export let saveSelection: () => void;
export let scrcpySessions: ScrcpySession[];
export let setSessionForeground: (s: ScrcpySession, fg: boolean) => void;
export let killSession: (s: ScrcpySession) => void;
export let running: boolean;
export let runScrcpy: () => void;
export let killRunning: boolean;
export let killScrcpyAdb: () => void;
export let runError: string;
export let scrcpyLogs: string[];
export let clearLogs: () => void;
export let showConsole: boolean;
export let minimizedConsole: boolean;
export let openConsole: () => void;
export let closeConsole: () => void;
export let toggleMinimizeConsole: () => void;
</script>

<div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">
  <div class="mb-6 w-full">
    <ProfileManager
      {profiles}
      {activeProfileIdx}
      onUpdateProfileField={updateProfileField}
    />
  </div>
  <select
    id="scrcpy-folder-select"
    class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
    bind:value={selected}
    onchange={e => setSelected(e.target.value)}
  >
    <option value="" disabled selected>폴더 선택...</option>
    {#each scrcpyFolders as folder}
      <option value={folder}>{folder}</option>
    {/each}
  </select>
  {#if selected}
    <div class="mt-2 text-green-400 text-sm">
      선택된 경로: <span class="font-mono">{selected}</span>
    </div>
  {/if}
  <ScrcpySessionList
    {scrcpySessions}
  onForeground={s => setSessionForeground(s, true)}
  onBackground={s => setSessionForeground(s, false)}
  onKill={killSession}
  />
  <div class="w-full flex gap-2 mt-2">
    <button
      class="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
      onclick={saveSelection}
    >
      프로필 저장
    </button>
    <button
      class="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition disabled:opacity-50"
      onclick={runScrcpy}
      disabled={!selected || running}
    >
      {running ? '실행 중...' : 'SCRCPY 실행'}
    </button>
    <button
      class="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition disabled:opacity-50"
      onclick={killScrcpyAdb}
      disabled={killRunning}
    >
      {killRunning ? '종료 중...' : 'SCRCPY/ADB 강제종료'}
    </button>
  </div>
  {#if showSaved}
    <div class="mt-1 text-blue-400 text-xs">프로필이 저장되었습니다!</div>
  {/if}
  {#if runError}
    <div class="mt-1 text-red-400 text-xs">{runError}</div>
  {/if}
  <ConsoleLog
    logs={scrcpyLogs}
    onClear={clearLogs}
    show={showConsole}
    minimized={minimizedConsole}
    onClose={closeConsole}
    onMinimize={toggleMinimizeConsole}
  />
  <div class="fixed z-40 right-6 bottom-6">
    {#if !showConsole}
      <button
        class="px-4 py-2 rounded-full bg-zinc-800 text-green-300 shadow-lg border border-zinc-700 hover:bg-zinc-700 transition"
        onclick={openConsole}
      >
        콘솔 열기
      </button>
    {/if}
  </div>
</div>
