<script lang="ts">
/// <reference path="./global.d.ts" />
// Svelte 5 룬: signal import 제거, $state 사용
import HomePage from './components/pages/HomePage.svelte';
import SessionList from './components/organisms/SessionList.svelte';
import ProfileManager from './components/organisms/ProfileManager.svelte';

// window.bridge 타입 확장 (최소한의 타입 선언)
type Bridge = {
  getVersion: (opt: 'electron' | 'node') => Promise<string>;
  killScrcpyAdb: () => Promise<any>;
  scanScrcpyFolders: () => Promise<string[]>;
  runScrcpy: (params: { folder: string; device: string; resolution: string; dpi: string }) => Promise<any>;
  setScrcpyForeground?: (title: string, fg: boolean) => Promise<void>;
  killScrcpySession?: (pid: number) => Promise<void>;
  listScrcpySessions?: () => Promise<ScrcpySession[]>;
  onScrcpySessionUpdate?: (cb: (msg: any) => void) => void;
  saveProfiles?: (profiles: Profile[]) => Promise<{ success: boolean; error?: string }>;
};
declare global {
  interface Window {
    bridge: Bridge;
    scrcpyLog?: { on: (cb: (msg: string) => void) => void };
  }
}
  // 개발 모드 감지
  const isDev = process.env.NODE_ENV === 'development' || location.hostname === 'localhost';
  // 세션별 포그라운드/백그라운드 전환 (명확히 분리)
  async function setSessionForeground(session: ScrcpySession, foreground: boolean) {
    const title = `SCRCPY_${session.device}`;
    if (isDev) {
      console.log(`[DEV] setSessionForeground 클릭:`, { session, foreground, title });
    }
    if (window.bridge.setScrcpyForeground) {
      await window.bridge.setScrcpyForeground(title, foreground);
    } else {
      if (isDev) console.warn('setScrcpyForeground 미구현');
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
    if (window.bridge.killScrcpySession) {
      await window.bridge.killScrcpySession(session.pid);
    } else {
      if (isDev) console.warn('killScrcpySession 미구현');
    }
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
  let scrcpySessions: ScrcpySession[] = $state([]);
  let scrcpyLogs: string[] = $state([]);

  // 세션 목록 불러오기 및 실시간 감시
  async function refreshScrcpySessions() {
    if (window.bridge.listScrcpySessions) {
      scrcpySessions = await window.bridge.listScrcpySessions();
      console.log('[refreshScrcpySessions] scrcpySessions:', scrcpySessions);
    } else {
      if (isDev) console.warn('listScrcpySessions 미구현');
    }
  }
  if (typeof window !== 'undefined' && window.bridge?.onScrcpySessionUpdate) {
    window.bridge.onScrcpySessionUpdate((msg: any) => {
      if (msg.type === 'start') {
        scrcpySessions = [...scrcpySessions, msg.session];
      } else if (msg.type === 'end') {
        scrcpySessions = scrcpySessions.filter((s) => s.id !== msg.sessionId);
      } else if (msg.type === 'foreground') {
        scrcpySessions = scrcpySessions.map((s) => s.id === msg.sessionId ? { ...s, foreground: msg.foreground } : s);
      }
    });
    // 최초 로딩
    refreshScrcpySessions();
  }

  async function toggleSessionForeground(session: ScrcpySession) {
    if (window.scrcpyLog) {
      window.scrcpyLog.on((msg: string) => {
        scrcpyLogs = [...scrcpyLogs, msg];
      });
    }
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
  let profiles: Profile[] = $state([
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
    const arr = [...profiles];
    arr[activeProfileIdx] = { ...arr[activeProfileIdx], [field]: value };
    profiles = arr;
  }
  let scrcpyFolders: string[] = $state([]);
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
      if (window.bridge.saveProfiles) {
        const result = await window.bridge.saveProfiles(profiles);
        if (result.success) {
          showSaved = true;
        } else {
          runError = result.error || '프로필 저장 실패';
        }
      } else {
        runError = 'saveProfiles 미구현';
      }
    } catch (e) {
      runError = String(e);
    }
  }
      let running = $state(false);
      let killRunning = $state(false);
      let runError = $state('');

      async function runScrcpy() {
        running = true;
        try {
          // 실제 SCRCPY 실행 로직 필요
          // await window.bridge.runScrcpy(...)
        } catch (e) {
          runError = String(e);
        } finally {
          running = false;
        }
      }

      async function killScrcpyAdb() {
        killRunning = true;
        try {
          // 실제 SCRCPY/ADB 종료 로직 필요
          // await window.bridge.killScrcpyAdb(...)
        } catch (e) {
          runError = String(e);
        } finally {
          killRunning = false;
        }
      }

  $effect(() => {
    if (scrcpyFolders.length === 0 && !loading) loadFolders();
  });
</script>


<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
  <div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">
    <HomePage
      selected={selected}
      scrcpyFolders={scrcpyFolders}
      loading={loading}
      onSelectFolder={selectFolder}
    />
    <SessionList
      sessions={scrcpySessions}
  onForeground={(session: ScrcpySession) => setSessionForeground(session, true)}
  onBackground={(session: ScrcpySession) => setSessionForeground(session, false)}
      onKill={killSession}
    />
    <ProfileManager
      profiles={profiles}
      activeProfileIdx={activeProfileIdx}
      newProfileName={newProfileName}
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
              <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" value={newProfileName} oninput={e => (newProfileName = (e.target as HTMLInputElement)?.value ?? '')} onkeydown={e => (e.key === 'Enter' && addProfile())} />
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
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" value={profiles[activeProfileIdx].device} oninput={e => updateProfileField('device', (e.target as HTMLInputElement)?.value ?? '')} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" value={profiles[activeProfileIdx].resolution} oninput={e => updateProfileField('resolution', (e.target as HTMLInputElement)?.value ?? '')} />
          <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" value={profiles[activeProfileIdx].dpi} oninput={e => updateProfileField('dpi', (e.target as HTMLInputElement)?.value ?? '')} />
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
