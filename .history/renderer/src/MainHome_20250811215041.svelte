<script lang="ts">
import { signal } from 'svelte';
import HomePage from './components/pages/HomePage.svelte';
import SessionList from './components/organisms/SessionList.svelte';
import ProfileManager from './components/organisms/ProfileManager.svelte';
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
  const scrcpySessions = signal<ScrcpySession[]>([]);

  // 세션 목록 불러오기 및 실시간 감시
  async function refreshScrcpySessions() {
  scrcpySessions.set(await window.bridge.listScrcpySessions());
    console.log('[refreshScrcpySessions] scrcpySessions:', scrcpySessions);
  }
  if (typeof window !== 'undefined' && window.bridge?.onScrcpySessionUpdate) {
    window.bridge.onScrcpySessionUpdate((msg) => {
      if (msg.type === 'start') {
  scrcpySessions.set([...scrcpySessions(), msg.session]);
      } else if (msg.type === 'end') {
  scrcpySessions.set(scrcpySessions().filter(s => s.id !== msg.sessionId));
      } else if (msg.type === 'foreground') {
  scrcpySessions.set(scrcpySessions().map(s => s.id === msg.sessionId ? { ...s, foreground: msg.foreground } : s));
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


// ...기존 script 코드만 남기고, 템플릿/HTML/Svelte 문법은 모두 제거...

  // 프로필 관리용 상태
  type Profile = {
    name: string;
    device: string;
    resolution: string;
    dpi: string;
  };
  const profiles = signal<Profile[]>([
    { name: '기본 프로필', device: '', resolution: '', dpi: '' }
  ]);
  const activeProfileIdx = signal(0);
  const newProfileName = signal('');

  function addProfile() {
    if (newProfileName().trim()) {
      profiles.set([...profiles(), { name: newProfileName(), device: '', resolution: '', dpi: '' }]);
      newProfileName.set('');
      activeProfileIdx.set(profiles().length - 1);
    }
  }
  function removeProfile(idx: number) {
  if (profiles().length === 1) return;
  profiles.set(profiles().filter((_, i) => i !== idx));
  if (activeProfileIdx() >= profiles().length) activeProfileIdx.set(profiles().length - 1);
  }
  function selectProfile(idx: number) {
  activeProfileIdx.set(idx);
  }
  function updateProfileField(field: keyof Profile, value: string) {
  const arr = [...profiles()];
  arr[activeProfileIdx()] = { ...arr[activeProfileIdx()], [field]: value };
  profiles.set(arr);
  }
  const scrcpyFolders = signal<string[]>([]);
  const selected = signal('');
  const loading = signal(false);
  const showSaved = signal(false);

  async function loadFolders() {
  loading.set(true);
  scrcpyFolders.set(await window.bridge.scanScrcpyFolders());
  loading.set(false);
  }

  function selectFolder(folder: string) {
  selected.set(folder);
  showSaved.set(false);
  }


  async function saveSelection() {
    showSaved.set(false);
    try {
      const result = await window.bridge.saveProfiles(profiles());
      if (result.success) {
        showSaved.set(true);
      } else {
        runError = result.error || '프로필 저장 실패';
      }
    } catch (e) {
      runError = String(e);
    }
  }

  $effect(() => {
  if (scrcpyFolders().length === 0 && !loading()) loadFolders();
  });
</script>


<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
  <div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">
    <HomePage
      selected={selected()}
      scrcpyFolders={scrcpyFolders()}
      loading={loading()}
      onSelectFolder={selectFolder}
    />
    <SessionList
      sessions={scrcpySessions()}
      onForeground={(session) => setSessionForeground(session, true)}
      onBackground={(session) => setSessionForeground(session, false)}
      onKill={killSession}
    />
    <ProfileManager
      profiles={profiles()}
      activeProfileIdx={activeProfileIdx()}
      newProfileName={newProfileName()}
      onAddProfile={addProfile}
      onRemoveProfile={removeProfile}
      onSelectProfile={selectProfile}
      onUpdateProfileField={updateProfileField}
    />
    <!-- 기타 버튼/콘솔 등은 추후 분리 -->
  </div>
</div>


    <div class="w-full mb-8">
      <div class="bg-zinc-900 rounded-xl shadow p-5 border border-zinc-800 mb-4">
        <h2 class="text-lg font-bold mb-3 text-blue-400">프로필 관리</h2>
        <section class="w-full flex flex-col gap-2 mb-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-sm">프로필 목록</span>
              <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" value={newProfileName()} oninput={e => newProfileName.set(e.target.value)} onkeydown={e => e.key === 'Enter' && addProfile()} />
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
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" value={profiles()[activeProfileIdx()].device} oninput={e => updateProfileField('device', e.target.value)} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" value={profiles()[activeProfileIdx()].resolution} oninput={e => updateProfileField('resolution', e.target.value)} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" value={profiles()[activeProfileIdx()].dpi} oninput={e => updateProfileField('dpi', e.target.value)} />
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
