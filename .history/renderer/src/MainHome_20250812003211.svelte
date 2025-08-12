<script lang="ts">
  import Button from './components/atoms/Button.svelte';
  import Input from './components/atoms/Input.svelte';
  import ProfileManager from './components/organisms/ProfileManager.svelte';
  import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
  import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
  import {
    refreshSessions,
    setSessionForeground,
    killSession,
    loadFolders,
    addProfile,
    removeProfile,
    selectProfile,
    updateProfileField,
    saveSelection
  } from './lib/features/scrcpy/scrcpy.actions';
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
        device: profile.connection?.device,
        resolution: profile.video?.resolution,
        dpi: profile.video?.dpi
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
    connection: any;
    video: any;
    // ...audio, input, virtualDisplay, window, recording, utility 등 추가
  };
  let selected = $state<string>('');
  let loading = $state(false);
  let scrcpyFolders = $state<string[]>([]);
  let profiles = $state<Profile[]>([
    {
      name: '기본 프로필',
      connection: {},
      video: {},
      // ...audio, input, virtualDisplay, window, recording, utility 등 초기값
    }
  ]);
  let activeProfileIdx = $state(0);
  let newProfileName = $state('');
  let showSaved = $state(false);

  // profile 액션 핸들러
  function handleAddProfile() {
    profiles = addProfile(profiles, newProfileName || `프로필${profiles.length + 1}`);
    activeProfileIdx = profiles.length - 1;
    newProfileName = '';
    showSaved = false;
  }
  function handleRemoveProfile(idx: number) {
    profiles = removeProfile(profiles, idx);
    if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
    showSaved = false;
  }
  function handleSelectProfile(idx: number) {
    activeProfileIdx = selectProfile(idx);
    showSaved = false;
  }
  function handleUpdateProfileField(idx: number, field: string, value: any) {
    const { profiles: next } = updateProfileField(profiles, idx, field, value);
    profiles = next;
    showSaved = false;
  }
  function handleSaveSelection() {
    saveSelection();
    showSaved = true;
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

        <!-- 프로필 리스트/선택/추가/삭제 -->
        <div class="flex gap-2 my-2">
          {#each profiles as p, idx}
            <Button
              class={`px-2 py-1 rounded border text-xs${idx === activeProfileIdx ? ' selected' : ''}`}
              onclick={() => handleSelectProfile(idx)}
            >{p.name || `프로필${idx + 1}`}</Button>
            <Button
              title="삭제"
              disabled={profiles.length <= 1}
              class="text-red-400 text-xs"
              onclick={() => handleRemoveProfile(idx)}
            >🗑️</Button>
          {/each}
          <Input
            className="px-1 py-0.5 border rounded text-xs w-24"
            placeholder="새 프로필명"
            value={newProfileName}
            onInput={e => newProfileName = e.target.value}
            onkeydown={(e) => { if (e.key === 'Enter') handleAddProfile(); }}
          />
          <Button class="text-green-400 text-xs" onclick={handleAddProfile}>＋</Button>
        </div>

        <!-- 프로필 상세/입력 -->
        <ProfileManager
          {profiles}
          activeProfileIdx={activeProfileIdx}
          onUpdateProfileField={handleUpdateProfileField}
        />
      {/if}
    {/if}

    <ScrcpySessionList
      sessions={scrcpySessions}
      onForeground={(session) => setSessionForeground(session, true)}
      onBackground={(session) => setSessionForeground(session, false)}
      onKill={killSession}
    />

    <div class="w-full flex gap-2 mt-2">
      <Button
        class="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
        onclick={handleSaveSelection}
      >
        프로필 저장
      </Button>
      <Button
        class="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition disabled:opacity-50"
        onclick={runScrcpy}
        disabled={!selected || running}
      >
        {running ? '실행 중...' : 'SCRCPY 실행'}
      </Button>
      <Button
        class="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition disabled:opacity-50"
        onclick={killScrcpyAdb}
        disabled={killRunning}
      >
        {killRunning ? '종료 중...' : 'SCRCPY/ADB 강제종료'}
      </Button>
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
        <Button
          class="px-4 py-2 rounded-full bg-zinc-800 text-green-300 shadow-lg border border-zinc-700 hover:bg-zinc-700 transition"
          onclick={openConsole}
        >
          콘솔 열기
        </Button>
      {/if}
    </div>

  </div>
</div>
