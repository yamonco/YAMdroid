// 프로필 관련 핸들러 함수 정의
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
  showSaved = true;
  setTimeout(() => {
    showSaved = false;
  }, 2000);
}
<script lang="ts">
  import ProfileManager from './components/organisms/ProfileManager.svelte';
  import ProfileListCard from './components/organisms/ProfileListCard.svelte';
  import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
  import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
  import { refreshSessions, setSessionForeground, killSession, loadFolders } from './lib/features/scrcpy/scrcpy.actions';

  // 루트 상태 선언 (SPA 원칙)
  let scrcpyFolders: string[] = [];
  let loading = false;
  let selected = '';
  let profiles = [];
  let activeProfileIdx = 0;
  let newProfileName = '';
  let showSaved = false;
  let scrcpySessions: ScrcpySession[] = [];
  let running = false;
  let killRunning = false;
  let runError = '';
  let scrcpyLogs: string[] = [];
  let showConsole = false;
  let minimizedConsole = false;

  // 폴더 목록 최초 로딩 (Svelte 5 effect)
  $effect(() => {
    (async () => {
      if (scrcpyFolders.length === 0 && !loading) {
        loading = true;
        scrcpyFolders = await loadFolders();
        loading = false;
      }
    })();
  });



  // 세션 목록 불러오기 및 실시간 감시
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';


</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
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
</div>


