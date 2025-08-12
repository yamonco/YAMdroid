<script lang="ts">
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';
  // Svelte 5 $state 방식으로 상태 선언
  $state scrcpyFolders: string[] = [];
  $state loading = false;
  $state selected = '';
  $state profiles: { name: string; device: string; resolution: string; dpi: string }[] = [];
  $state activeProfileIdx = 0;
  $state newProfileName = '';
  $state showSaved = false;
  $state scrcpySessions: any[] = [];
  $state running = false;
  $state killRunning = false;
  $state runError = '';
  $state scrcpyLogs: string[] = [];
  $state showConsole = false;
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
  </main>
