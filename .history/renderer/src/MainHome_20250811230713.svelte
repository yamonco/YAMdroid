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
  async function refreshScrcpySessions() {
    scrcpySessions = await refreshSessions();
    console.log('[refreshScrcpySessions] scrcpySessions:', scrcpySessions);
  }
  if (typeof window !== 'undefined' && window.bridge?.onScrcpySessionUpdate) {
    window.bridge.onScrcpySessionUpdate((msg) => {
      if (msg.type === 'start') {
        scrcpySessions = [...scrcpySessions, msg.session];
      } else if (msg.type === 'end') {
        scrcpySessions = scrcpySessions.filter(s => s.id !== msg.sessionId);
      } else if (msg.type === 'foreground') {
        scrcpySessions = scrcpySessions.map(s => s.id === msg.sessionId ? { ...s, foreground: msg.foreground } : s);
      }
    });
    // 최초 로딩
    refreshScrcpySessions();
  }

  // (toggleSessionForeground는 setSessionForeground 액션으로 대체)
  import ConsoleLog from './components/atoms/ConsoleLog.svelte';
  // SCRCPY 콘솔 로그
  let scrcpyLogs = $state<string[]>([]);
  if (typeof window !== 'undefined' && window.scrcpyLog) {
    window.scrcpyLog.on((msg: string) => {
      scrcpyLogs = [...scrcpyLogs, msg];
    });
  }
  function clearLogs() {
    scrcpyLogs = [];
  }

  // 콘솔 플로팅 위젯 상태
  let showConsole = $state(false);
  let minimizedConsole = $state(false);
  function openConsole() { showConsole = true; minimizedConsole = false; }
  function closeConsole() { showConsole = false; }
  function toggleMinimizeConsole() { minimizedConsole = !minimizedConsole; }

  // SCRCPY 실행/종료 상태
  let running = $state(false);
  let killRunning = $state(false);
  let runError = $state('');

  async function runScrcpy() {
    if (!selected) return;
    running = true;
    runError = '';
    try {
      const profile = profiles[activeProfileIdx];
      const result = await window.bridge.runScrcpy({
        folder: selected,
        device: profile.device,
        resolution: profile.resolution,
        dpi: profile.dpi
      });
      if (!result.success) {
        runError = result.error || 'SCRCPY 실행 실패';
      }
    } catch (e) {
      runError = String(e);
    } finally {
      running = false;
    }
  }

  async function killScrcpyAdb() {
    killRunning = true;
    try {
      await window.bridge.killScrcpyAdb();
    } catch (e) {
      runError = String(e);
    } finally {
      killRunning = false;
    }
  }

  // 현재 뷰 상태 (예: SCRCPY, 더미 탭 등)
  let currentView = 'SCRCPY';
  $effect(() => {
    // 뷰가 변경될 때마다 터미널에 출력
    console.log(`[현재 뷰]`, currentView);
  });

  // 프로필 관리용 상태
  type Profile = {
    name: string;
    device: string;
    resolution: string;
    dpi: string;
  };
  let selected = $state<string>('');
  let loading = $state(false);
  let scrcpyFolders = $state<string[]>([]);
  let profiles = $state<Profile[]>([
    { name: '기본 프로필', device: '', resolution: '', dpi: '' }
  ]);
  let activeProfileIdx = $state(0);
  let newProfileName = $state('');
  let showSaved = $state(false);

  function addProfile() {
    if (newProfileName.trim()) {
      profiles = [...profiles, { name: newProfileName, device: '', resolution: '', dpi: '' }];
      newProfileName = '';
      activeProfileIdx = profiles.length - 1;
    }
  }
  function removeProfile(idx: number) {
    if (profiles.length === 1) return;
    profiles = profiles.filter((_, i) => i !== idx);
    if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
  }
  function selectProfile(idx: number) {
    activeProfileIdx = idx;
  }
  function updateProfileField(field: string, value: string) {
    if (field === 'newProfileName') {
      newProfileName = value;
      return;
    }
    profiles[activeProfileIdx] = { ...profiles[activeProfileIdx], [field]: value };
    profiles = [...profiles];
  }

  function saveSelection() {
    // 실제 저장 로직은 필요에 따라 구현
    console.log('선택된 경로와 프로필 저장:', selected, profiles[activeProfileIdx]);
    showSaved = true;
    setTimeout(() => {
      showSaved = false;
    }, 2000);
  }
</script>

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

      {#if selected}
        <div class="mt-2 text-green-400 text-sm">
          선택된 경로: <span class="font-mono">{selected}</span>
        </div>

        <!-- 프로필 목록/추가/삭제/선택 카드 + 프로필 편집 탭 -->
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
