<script lang="ts">
  // 프로필 관련 핸들러 함수 정의
  function addProfile() {
    if (newProfileName()) {
      profiles.set([
        ...profiles(),
        { name: newProfileName(), device: '', resolution: '', dpi: '' }
      ]);
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
  function updateProfileField(field: string, value: string) {
    if (field === 'newProfileName') {
      newProfileName.set(value);
      return;
    }
    const arr = profiles();
    arr[activeProfileIdx()] = { ...arr[activeProfileIdx()], [field]: value };
    profiles.set([...arr]);
  }
  function saveSelection() {
    // 실제 저장 로직은 필요에 따라 구현
    showSaved.set(true);
    setTimeout(() => {
      showSaved.set(false);
    }, 2000);
  }
  import ProfileManager from './components/organisms/ProfileManager.svelte';
  import ProfileListCard from './components/organisms/ProfileListCard.svelte';
  import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
  import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
  import { refreshSessions, setSessionForeground, killSession, loadFolders } from './lib/features/scrcpy/scrcpy.actions';

  // 루트 상태 선언 (SPA 원칙)
  const scrcpyFolders = $state<string[]>([]);
  const loading = $state(false);
  const selected = $state('');
  const profiles = $state<{ name: string; device: string; resolution: string; dpi: string }[]>([]);
  const activeProfileIdx = $state(0);
  const newProfileName = $state('');
  const showSaved = $state(false);
  const scrcpySessions = $state<ScrcpySession[]>([]);
  const running = $state(false);
  const killRunning = $state(false);
  const runError = $state('');
  const scrcpyLogs = $state<string[]>([]);
  const showConsole = $state(false);
  const minimizedConsole = $state(false);

  // 미정의 함수 임시 대체 (실제 구현 필요)
  function runScrcpy() {}
  function killScrcpyAdb() {}
  function clearLogs() {}
  function openConsole() {}
  function closeConsole() {}
  function toggleMinimizeConsole() {}

  // 폴더 목록 최초 로딩 (Svelte 5 effect)
  $effect(() => {
    (async () => {
      if (scrcpyFolders().length === 0 && !loading()) {
        loading.set(true);
        scrcpyFolders.set(await loadFolders());
        loading.set(false);
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
  setSelected={v => selected.set(v)}
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


