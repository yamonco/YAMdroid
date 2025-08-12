
<script lang="ts">
import './app.pane.css';
import Button from './components/atoms/Button.svelte';
import Input from './components/atoms/Input.svelte';
import Dropdown from './components/atoms/Dropdown.svelte';
// scrcpy 폴더 옵션 변환 (Svelte 5 runes)
let folderOptions = $derived(() => scrcpyFolders.map(f => ({ label: f, value: f })));
import ProfilePage from './components/pages/ProfilePage.svelte';
import MainNavPane from './components/organisms/MainNavPane.svelte';
import DockedConsole from './components/organisms/DockedConsole.svelte';
import SettingPage from './components/pages/SettingPage.svelte';
import AboutPage from './components/pages/AboutPage.svelte';
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

import { getScrcpyRoot } from './lib/features/scrcpy/scrcpy.config';
let selected = $state<string>('');
let loading = $state(false);
let scrcpyFolders = $state<string[]>([]);
let profiles = $state<any[]>([
  {
    name: '기본 프로필',
    connection: {},
    video: {},
  }
]);
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

<div class="pane-root flex flex-col w-full h-full text-zinc-200">
  <div class="flex flex-row flex-1 min-h-0 h-full">
    <!-- 사이드바 네비게이션 -->
    <MainNavPane active={activeNav} onSelect={id => activeNav = id} />
    <!-- 메인 컨텐츠: 탭별 뷰 -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 min-h-0 overflow-y-auto">
        {#if activeNav === 'home'}
          <ProfilePage
            profiles={profiles}
            activeProfileId={activeProfileIdx}
            newProfileName={newProfileName}
            onSelectProfile={handleSelectProfile}
            onAddProfile={handleAddProfile}
            onNewProfileNameInput={v => newProfileName = v}
            onSaveProfile={handleSaveSelection}
            toast={null}
            activeTab={activeTab}
            onTabChange={tab => activeTab = tab}
            deviceForm={deviceForm}
            videoForm={videoForm}
            onDeviceFormChange={handleDeviceFormChange}
            onVideoFormChange={handleVideoFormChange}
            onDeviceFormSave={handleDeviceFormSave}
            onVideoFormSave={handleVideoFormSave}
          />
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
          onClose={closeConsole}
          onMinimize={toggleMinimizeConsole}
        />
      </div>
    </div>
  </div>
</div>
