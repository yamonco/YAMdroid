<script lang="ts">
  // 프로필 관련 핸들러 함수 정의
  function addProfile() {
    if ($newProfileName.trim()) {
      profiles = [
        ...$profiles,
        { name: $newProfileName, device: '', resolution: '', dpi: '' }
      ];
      newProfileName = '';
      activeProfileIdx = $profiles.length - 1;
    }
  }
  function removeProfile(idx: number) {
  if ($profiles.length === 1) return;
  profiles = $profiles.filter((_, i) => i !== idx);
  if ($activeProfileIdx >= $profiles.length) activeProfileIdx = $profiles.length - 1;
  }
  function selectProfile(idx: number) {
  activeProfileIdx = idx;
  }
  function updateProfileField(field: string, value: string) {
    if (field === 'newProfileName') {
      newProfileName = value;
      return;
    }
    profiles[$activeProfileIdx] = { ...$profiles[$activeProfileIdx], [field]: value };
    profiles = [...$profiles];
  }
  function openConsole() {}
  function closeConsole() {}
  function toggleMinimizeConsole() {}

  // 폴더 목록 최초 로딩 (Svelte 5 effect)
  $effect(() => {
    (async () => {
      if ($scrcpyFolders.length === 0 && !$loading) {
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


