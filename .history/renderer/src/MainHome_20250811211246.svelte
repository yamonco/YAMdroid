<script lang="ts">
  // 개발 모드 감지
  const isDev = process.env.NODE_ENV === 'development' || location.hostname === 'localhost';
  // 세션별 포그라운드/백그라운드 전환 (명확히 분리)
  async function setSessionForeground(session: ScrcpySession, foreground: boolean) {
    const title = `SCRCPY_${session.device}`;
    if (isDev) {
      console.log(`[DEV] setSessionForeground 클릭:`, { session, foreground, title });
    }
    if (foreground) {
      if (isDev) console.log(`[DEV] 포그라운드 요청:`, title);
      await window.bridge.setScrcpyForeground(title, true);
    } else {
      if (isDev) console.log(`[DEV] 백그라운드 요청:`, title);
      await window.bridge.setScrcpyForeground(title, false);
    }
    if (isDev) {
      console.log(`[DEV] setSessionForeground 완료:`, { session, foreground, title });
    }
  }

  // 세션별 종료
  async function killSession(session: ScrcpySession) {
    if (isDev) {
      console.log(`[DEV] killSession 클릭:`, { session });
    }
    await window.bridge.killScrcpySession(session.pid);
    if (isDev) {
      console.log(`[DEV] killSession 완료:`, { session });
    }
  }
  // SCRCPY 세션 관리 상태
  type ScrcpySession = {
    id: string;
    pid: number;
    folder: string;
    device: string;
    resolution: string;
    dpi: string;
    foreground: boolean;
  };
  let scrcpySessions = $state<ScrcpySession[]>([]);

  // 세션 목록 불러오기 및 실시간 감시
  async function refreshScrcpySessions() {
    scrcpySessions = await window.bridge.listScrcpySessions();
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

  async function toggleSessionForeground(session: ScrcpySession) {
    window.scrcpyLog.on((msg: string) => {
      scrcpyLogs = [...scrcpyLogs, msg];
    });
  }
  function clearLogs() {
    scrcpyLogs = [];
  }

      <div class="w-full mb-8">
        <div class="bg-zinc-900 rounded-xl shadow p-5 border border-zinc-800 mb-4">
          <h2 class="text-lg font-bold mb-3 text-blue-400">SCRCPY 폴더 선택</h2>
          <label for="scrcpy-folder-select" class="block mb-2 font-medium">SCRCPY 버전 폴더 선택</label>
          {#if loading}
            <div class="mb-4">폴더 검색 중...</div>
          {:else if scrcpyFolders.length === 0}
            <div class="mb-4 text-red-400 text-center">
              SCRCPY 폴더가 없습니다.<br>
              <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
              <pre class="bg-zinc-950 border border-zinc-700 rounded p-3 mt-2 text-xs text-zinc-200 text-left select-text">
    running = true;
    runError = '';
    try {
      const profile = profiles[activeProfileIdx];
      const result = await window.bridge.runScrcpy({
        folder: selected,
        device: profile.device,
              </pre>
              <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
            </div>
          {:else}
            <select id="scrcpy-folder-select" class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" bind:value={selected}>
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
      </div>
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
  let profiles = $state<Profile[]>([
    { name: '기본 프로필', device: '', resolution: '', dpi: '' }
  ]);
  let activeProfileIdx = $state(0);
  let newProfileName = $state('');

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
  function updateProfileField(field: keyof Profile, value: string) {
    profiles[activeProfileIdx] = { ...profiles[activeProfileIdx], [field]: value };
    profiles = [...profiles];
  }
  let scrcpyFolders = $state<string[]>([]);
  let selected = $state('');
  let loading = $state(false);
  let showSaved = $state(false);

  async function loadFolders() {
    loading = true;
    scrcpyFolders = await window.bridge.scanScrcpyFolders();
    loading = false;
  }

  function selectFolder(folder: string) {
    selected = folder;
    showSaved = false;
  }


  async function saveSelection() {
    showSaved = false;
    try {
      const result = await window.bridge.saveProfiles(profiles);
      if (result.success) {
        showSaved = true;
      } else {
        runError = result.error || '프로필 저장 실패';
      }
    } catch (e) {
      runError = String(e);
    }
  }

  $effect(() => {
    if (scrcpyFolders.length === 0 && !loading) loadFolders();
  });
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
  <div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">

  {#if scrcpySessions.length > 0}
      <div class="w-full mb-6">
        <h2 class="text-lg font-bold mb-2 text-green-400">실행 중인 SCRCPY 세션</h2>
        <div class="flex flex-col gap-3">
          {#each scrcpySessions as session}
            <div class="bg-zinc-800 rounded-lg p-4 flex flex-col gap-2 border border-zinc-700 shadow">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold text-blue-300">PID:</span> <span class="font-mono">{session.pid}</span>
                  <span class="ml-4 font-semibold text-blue-300">경로:</span> <span class="font-mono">{session.folder}</span>
                </div>
                <div class="flex gap-2 ml-2">
                  <button class="px-3 py-1 rounded bg-blue-700 text-xs text-white border border-blue-500 hover:bg-blue-800 transition" onclick={() => setSessionForeground(session, true)} disabled={session.foreground}>
                    포그라운드
                  </button>
                  <button class="px-3 py-1 rounded bg-gray-700 text-xs text-white border border-gray-500 hover:bg-gray-800 transition" onclick={() => setSessionForeground(session, false)} disabled={!session.foreground}>
                    백그라운드
                  </button>
                  <button class="px-3 py-1 rounded bg-red-700 text-xs text-white border border-red-500 hover:bg-red-800 transition" onclick={() => killSession(session)}>
                    종료
                  </button>
                </div>
              </div>
              <div class="text-xs text-zinc-400">해상도: {session.resolution} / DPI: {session.dpi}</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    <h1 class="text-2xl font-bold mb-6 text-center">SCRCPY 프로필 관리</h1>
    <div class="w-full mb-8">
      <label for="scrcpy-folder-select" class="block mb-2 font-medium">SCRCPY 버전 폴더 선택</label>
      {#if loading}
        <div class="mb-4">폴더 검색 중...</div>
      {:else if scrcpyFolders.length === 0}
        <div class="mb-4 text-red-400 text-center">
          SCRCPY 폴더가 없습니다.<br>
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
        <select id="scrcpy-folder-select" class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" bind:value={selected}>
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

    <section class="w-full flex flex-col gap-2 mb-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold text-sm">프로필 목록</span>
  <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" bind:value={newProfileName} onkeydown={(e) => e.key === 'Enter' && addProfile()} />
  <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" onclick={addProfile}>추가</button>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each profiles as profile, idx}
          <div class="flex items-center gap-1">
            <button class={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`} onclick={() => selectProfile(idx)}>{profile.name}</button>
            {#if profiles.length > 1}
              <button type="button" class="text-xs text-red-400 cursor-pointer bg-transparent border-0" onclick={() => removeProfile(idx)} aria-label="프로필 삭제">✕</button>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
      <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정</div>
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" bind:value={profiles[activeProfileIdx].device} oninput={(e) => updateProfileField('device', (e.target as HTMLInputElement)?.value || '')} />
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" bind:value={profiles[activeProfileIdx].resolution} oninput={(e) => updateProfileField('resolution', (e.target as HTMLInputElement)?.value || '')} />
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" bind:value={profiles[activeProfileIdx].dpi} oninput={(e) => updateProfileField('dpi', (e.target as HTMLInputElement)?.value || '')} />
    </section>


    <div class="w-full flex gap-2 mt-2">
  <button class="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition" onclick={saveSelection}>프로필 저장</button>
  <button class="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition disabled:opacity-50" onclick={runScrcpy} disabled={!selected || running}>{running ? '실행 중...' : 'SCRCPY 실행'}</button>
  <button class="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition disabled:opacity-50" onclick={killScrcpyAdb} disabled={killRunning}>{killRunning ? '종료 중...' : 'SCRCPY/ADB 강제종료'}</button>
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
  </div>
  {#if !showConsole}
  <button class="fixed z-40 right-6 bottom-6 px-4 py-2 rounded-full bg-zinc-800 text-green-300 shadow-lg border border-zinc-700 hover:bg-zinc-700 transition" onclick={openConsole}>
      콘솔 열기
    </button>
  {/if}
</div>


    <div class="w-full mb-8">
      <div class="bg-zinc-900 rounded-xl shadow p-5 border border-zinc-800 mb-4">
        <h2 class="text-lg font-bold mb-3 text-blue-400">프로필 관리</h2>
        <section class="w-full flex flex-col gap-2 mb-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-sm">프로필 목록</span>
            <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" bind:value={newProfileName} onkeydown={(e) => e.key === 'Enter' && addProfile()} />
            <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" onclick={addProfile}>추가</button>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each profiles as profile, idx}
              <div class="flex items-center gap-1">
                <button class={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`} onclick={() => selectProfile(idx)}>{profile.name}</button>
                {#if profiles.length > 1}
                  <button type="button" class="text-xs text-red-400 cursor-pointer bg-transparent border-0" onclick={() => removeProfile(idx)} aria-label="프로필 삭제">✕</button>
                {/if}
              </div>
            {/each}
          </div>
        </section>
        <section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
          <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정</div>
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" bind:value={profiles[activeProfileIdx].device} oninput={(e) => updateProfileField('device', (e.target as HTMLInputElement)?.value || '')} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" bind:value={profiles[activeProfileIdx].resolution} oninput={(e) => updateProfileField('resolution', (e.target as HTMLInputElement)?.value || '')} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" bind:value={profiles[activeProfileIdx].dpi} oninput={(e) => updateProfileField('dpi', (e.target as HTMLInputElement)?.value || '')} />
        </section>
        <div class="w-full flex gap-2 mt-2">
          <button class="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition" onclick={saveSelection}>프로필 저장</button>
          <button class="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition disabled:opacity-50" onclick={runScrcpy} disabled={!selected || running}>{running ? '실행 중...' : 'SCRCPY 실행'}</button>
          <button class="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition disabled:opacity-50" onclick={killScrcpyAdb} disabled={killRunning}>{killRunning ? '종료 중...' : 'SCRCPY/ADB 강제종료'}</button>
        </div>
        {#if showSaved}
          <div class="mt-1 text-blue-400 text-xs">프로필이 저장되었습니다!</div>
        {/if}
        {#if runError}
          <div class="mt-1 text-red-400 text-xs">{runError}</div>
        {/if}
      </div>
    </div>
