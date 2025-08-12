<script lang="ts">
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';
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
</script>

<main>
  <ScrcpyHomePage {scrcpyFolders} {loading} {selected} {profiles} {activeProfileIdx} {newProfileName} {showSaved} {scrcpySessions} {running} {killRunning} {runError} {scrcpyLogs} {showConsole} {minimizedConsole}
    on:loadFolders={(e) => (scrcpyFolders = e.detail)}
    on:profileUpdated={(e) => (profiles = e.detail.profiles)}
    on:activeProfileChanged={(e) => (activeProfileIdx = e.detail)}
    on:newProfileNameChanged={(e) => (newProfileName = e.detail)}
    on:scrcpySessionStarted={(e) => (scrcpySessions = [...scrcpySessions, e.detail])}
    on:scrcpySessionStopped={(e) => (scrcpySessions = scrcpySessions.filter((s) => s !== e.detail))}
    on:runError={(e) => (runError = e.detail)}
    on:scrcpyLog={(e) => (scrcpyLogs = [...scrcpyLogs, e.detail])}
    on:consoleToggled={(e) => (showConsole = e.detail)}
    on:consoleMinimized={(e) => (minimizedConsole = e.detail)}
    on:profileSelected={(e) => handleSelectProfile(e.detail)}
    on:profileRemoved={(e) => handleRemoveProfile(e.detail)}
    on:profileAdded={() => handleAddProfile()}
    on:profileFieldUpdated={(e) => handleUpdateProfileField(e.detail.field, e.detail.value)}
  />
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
  }
</style>
