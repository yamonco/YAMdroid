<script lang="ts">
  // 상태 let 선언 (불필요한 $state, $profiles 등 제거)
  let scrcpyFolders: string[] = [];
  let loading = false;
  let selected = '';
  let profiles: { name: string; device: string; resolution: string; dpi: string }[] = [];
  let activeProfileIdx = 0;
  let newProfileName = '';
  let showSaved = false;
  let scrcpySessions = [];
  let running = false;
  let killRunning = false;
  let runError = '';
  let scrcpyLogs: string[] = [];
  let showConsole = false;
  let minimizedConsole = false;
  import { addProfile as addProfileAction, removeProfile as removeProfileAction, selectProfile as selectProfileAction, updateProfileField as updateProfileFieldAction } from './lib/features/scrcpy/scrcpy.actions';
  // 프로필 관련 상태 변경은 액션 함수로만 처리
  function handleAddProfile() {
    profiles = addProfileAction(profiles, newProfileName);
    newProfileName = '';
    activeProfileIdx = profiles.length - 1;
  }
  function handleRemoveProfile(idx: number) {
    profiles = removeProfileAction(profiles, idx);
    if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
  }
  function handleSelectProfile(idx: number) {
    activeProfileIdx = selectProfileAction(idx);
  }
  function handleUpdateProfileField(field: string, value: string) {
    if (field === 'newProfileName') {
      newProfileName = value;
      return;
    }
    const result = updateProfileFieldAction(profiles, activeProfileIdx, field, value);
    if (result.profiles) profiles = result.profiles;
    if (result.newProfileName !== undefined) newProfileName = result.newProfileName;
  }
  function openConsole() {}
  function closeConsole() {}
  function toggleMinimizeConsole() {}
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
    addProfile={handleAddProfile}
    removeProfile={handleRemoveProfile}
    selectProfile={handleSelectProfile}
    updateProfileField={handleUpdateProfileField}
    {showSaved}
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


