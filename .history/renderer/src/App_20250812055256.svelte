<svelte:head>
  <script>
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'synthwave');
    }
  </script>
</svelte:head>


<script lang="ts">
import { enableGlobalEventDebug } from './lib/devDebug';
if (import.meta.env?.DEV) enableGlobalEventDebug();
import './app.pane.css';
let folderOptions = $derived(() => scrcpyFolders.map(f => ({ label: f, value: f })));
import ProfilePage from './components/organisms/ProfilePage.svelte';
import DockedConsole from './components/organisms/DockedConsole.svelte';
import SettingPage from './components/pages/SettingPage.svelte';
import AboutPage from './components/pages/AboutPage.svelte';
import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';

import {
  addProfile,
  removeProfile,
  selectProfile,
  updateProfileField,
  loadFolders,
  refreshSessions,
  setSessionForeground,
  killSession,
  saveSelection
} from './lib/features/scrcpy/scrcpy.actions';
import { getProfiles, setProfiles } from './lib/features/profiles/profiles.actions';

import { getScrcpyRoot } from './lib/features/scrcpy/scrcpy.config';
// import { enableGlobalEventDebug } from './lib/devDebug'; // Duplicate import removed
let selected = $state<string>('');
let loading = $state(false);
let scrcpyFolders = $state<string[]>([]);
let profiles = $state<any[]>([]);
let activeProfileIdx = $state(0);
let newProfileName = $state('');
let showSaved = $state(false);
let activeNav = $state('home');
let activeTab = $state<'device' | 'video'>('device');
let deviceForm = $state({});
let videoForm = $state({});
let scrcpySessions = $state<any[]>([]);
let scrcpyLogs = $state<string[]>([]);
let showConsole = $state(false);
let minimizedConsole = $state(false);
let running = $state(false);
let killRunning = $state(false);
let runError = $state('');

$effect(() => {
  (async () => {
    if ((scrcpyFolders?.length ?? 0) === 0 && !loading) {
      loading = true;
      scrcpyFolders = await loadFolders();
      // SCRCPY 경로 저장값이 있으면 기본 선택
      const saved = getScrcpyRoot();
      if (saved && scrcpyFolders.includes(saved)) {
        selected = saved;
      } else if (scrcpyFolders.length > 0 && !selected) {
        selected = scrcpyFolders[0];
      }
      loading = false;
    }
    // 프로필 파일에서 불러오기
    profiles = await getProfiles();
  })();
});

function handleDeviceFormChange(field: string, value: any) {
  deviceForm = { ...deviceForm, [field]: value };
}
function handleVideoFormChange(field: string, value: any) {
  videoForm = { ...videoForm, [field]: value };
}
function handleDeviceFormSave() {}
function handleVideoFormSave() {}

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
  refreshScrcpySessions();
}
if (typeof window !== 'undefined' && window.scrcpyLog) {
  window.scrcpyLog.on((msg: string) => {
    scrcpyLogs = [...scrcpyLogs, msg];
  });
}
function clearLogs() { scrcpyLogs = []; }
function openConsole() { showConsole = true; minimizedConsole = false; }
function closeConsole() { showConsole = false; }
function toggleMinimizeConsole() { minimizedConsole = !minimizedConsole; }

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

let currentView = 'SCRCPY';
$effect(() => {
  console.log(`[현재 뷰]`, currentView);
});

async function handleAddProfile() {
  console.log('[App] handleAddProfile 진입');
  const next = addProfile(profiles, newProfileName || `프로필${profiles.length + 1}`);
  console.log('[handleAddProfile] next:', next);
  await setProfiles(next);
  console.log('[handleAddProfile] setProfiles 완료');
  const loaded = await getProfiles();
  console.log('[handleAddProfile] getProfiles 결과:', loaded);
  profiles = loaded;
  activeProfileIdx = profiles.length - 1;
  newProfileName = '';
  showSaved = false;
}
async function handleRemoveProfile(idx: number) {
  const next = removeProfile(profiles, idx);
  await setProfiles(next);
  profiles = await getProfiles();
  if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
  showSaved = false;
}
function handleSelectProfile(idx: number) {
  activeProfileIdx = selectProfile(idx);
  showSaved = false;
}
async function handleUpdateProfileField(idx: number, field: string, value: any) {
  const { profiles: next } = updateProfileField(profiles, idx, field, value);
  await setProfiles(next);
  profiles = await getProfiles();
  showSaved = false;
}
async function handleUpdateProfile(idx: number, data: any) {
  // idx 위치의 프로필을 data로 교체
  const next = profiles.map((p, i) => (i === idx ? { ...p, ...data } : p));
  console.log('[handleUpdateProfile] idx:', idx, 'data:', data, 'next:', next);
  await setProfiles(next);
  console.log('[handleUpdateProfile] setProfiles 완료');
  const loaded = await getProfiles();
  console.log('[handleUpdateProfile] getProfiles 결과:', loaded);
  profiles = loaded;
  showSaved = true;
}
</script>

<!-- Svelte 템플릿 -->

<div class="pane-root flex flex-col w-full h-full text-zinc-200">
  <!-- 최상단 네비게이션바 -->
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li><button type="button" role="menuitem" class={activeNav === 'home' ? 'active' : ''} onclick={() => activeNav = 'home'}>홈</button></li>
          <li><button type="button" role="menuitem" class={activeNav === 'setting' ? 'active' : ''} onclick={() => activeNav = 'setting'}>설정</button></li>
          <li><button type="button" role="menuitem" class={activeNav === 'about' ? 'active' : ''} onclick={() => activeNav = 'about'}>정보</button></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost text-xl">YAMdroid</a>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
      </button>
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
    </div>
  </div>
  <!-- 메인 컨텐츠: 탭별 뷰 -->
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex-1 min-h-0 overflow-y-auto">
      {#if activeNav === 'home'}
        <HomePage />
      {:else if activeNav === 'setting'}
        <SettingPage />
      {:else if activeNav === 'about'}
        <AboutPage />
      {/if}
    </div>
    <!-- 고정 하단 콘솔 -->
    <div class="shrink-0">
      <DockedConsole
        logs={scrcpyLogs}
        show={true}
        minimized={minimizedConsole}
        onClear={clearLogs}
        onMinimize={toggleMinimizeConsole}
      />
    </div>
  </div>
</div>
