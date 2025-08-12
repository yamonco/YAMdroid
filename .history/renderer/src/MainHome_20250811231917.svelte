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


