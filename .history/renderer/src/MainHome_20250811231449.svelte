<script lang="ts">
  import ProfileManager from './components/organisms/ProfileManager.svelte';
  import ProfileListCard from './components/organisms/ProfileListCard.svelte';
  import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
  import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
  import { refreshSessions, setSessionForeground, killSession, loadFolders } from './lib/features/scrcpy/scrcpy.actions';
  // 폴더 목록 최초 로딩 (Svelte 5 effect)
$effect(async () => {
  if (scrcpyFolders.length === 0 && !loading) {
    loading = true;
    scrcpyFolders = await loadFolders();
    loading = false;
  }
});

  let scrcpySessions = $state<ScrcpySession[]>([]);

  // 세션 목록 불러오기 및 실시간 감시
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';

</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
    {#if loading}
      <div class="mb-4">폴더 검색 중...</div>
    {:else if scrcpyFolders.length === 0}
      <div class="mb-4 text-red-400 text-center">
        <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
        <pre class="bg-zinc-950 border border-zinc-700 rounded p-3 mt-2 text-xs text-zinc-200 text-left select-text">
  resources/
    scrcpy/
      scrcpy-win64-v3.3/
        scrcpy.exe
      scrcpy-win64-v3.3.1/
        scrcpy.exe
        ...
        </pre>
        <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
      </div>
    {:else}
      <ScrcpyHomePage
        {scrcpyFolders}
        {selected}
        setSelected={v => selected = v}
        {loading}
        {profiles}
        {activeProfileIdx}
        {newProfileName}
        {addProfile}
        {removeProfile}
        {selectProfile}
        {updateProfileField}
        {showSaved}
        {saveSelection}
        {scrcpySessions}
        {setSessionForeground}
        {killSession}
        {running}
        {runScrcpy}
        {killRunning}
        {killScrcpyAdb}
        {runError}
        scrcpyLogs={scrcpyLogs}
        {clearLogs}
        {showConsole}
        {minimizedConsole}
        {openConsole}
        {closeConsole}
        {toggleMinimizeConsole}

      />
    {/if}
  </div>



<!-- Svelte 템플릿 -->
<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
  <div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">

    {#if loading}
      <div class="mb-4">폴더 검색 중...</div>
    {:else if scrcpyFolders.length === 0}
      <div class="mb-4 text-red-400 text-center">
        <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
        <pre class="bg-zinc-950 border border-zinc-700 rounded p-3 mt-2 text-xs text-zinc-200 text-left select-text">
resources/
  scrcpy/
    scrcpy-win64-v3.3/
      scrcpy.exe
    scrcpy-win64-v3.3.1/
      scrcpy.exe
      ...
        </pre>
        <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
      </div>
    {:else}
      <select
        id="scrcpy-folder-select"
        class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
  bind:value={selected}
      >
        <option value="" disabled selected>폴더 선택...</option>
        {#each scrcpyFolders as folder}
          <option value={folder}>{folder}</option>
        {/each}
      </select>

      <!-- 프로필 목록/추가/삭제/선택 카드 + 프로필 편집 탭: 항상 노출 -->
      <div class="mb-6 w-full">
        <ProfileManager
          {profiles}
          activeProfileIdx={activeProfileIdx}
          onUpdateProfileField={updateProfileField}
        >
          <ProfileListCard
            slot="profile-list-card"
            {profiles}
            {activeProfileIdx}
            newProfileName={newProfileName}
            onAddProfile={addProfile}
            onRemoveProfile={removeProfile}
            onSelectProfile={selectProfile}
            onUpdateProfileField={updateProfileField}
          />
        </ProfileManager>
      </div>
      {#if selected}
        <div class="mt-2 text-green-400 text-sm">
          선택된 경로: <span class="font-mono">{selected}</span>
        </div>
      {/if}
    {/if}

    <ScrcpySessionList
      sessions={scrcpySessions}
      onForeground={(session) => setSessionForeground(session, true)}
      onBackground={(session) => setSessionForeground(session, false)}
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
</div>
