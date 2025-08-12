<script lang="ts">
  import ProfileManager from './components/organisms/ProfileManager.svelte';
  import ProfileListCard from './components/organisms/ProfileListCard.svelte';
  import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
  import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
  import { refreshSessions, setSessionForeground, killSession, loadFolders } from './lib/features/scrcpy/scrcpy.actions';
  // 폴더 목록 최초 로딩 (Svelte 5 effect)
$effect(async () => {
  if (scrcpyFolders.length === 0 && !loading) {
    loading = true;
    scrcpyFolders = await loadFolders();
    loading = false;
  }
});

  let scrcpySessions = $state<ScrcpySession[]>([]);

  // 세션 목록 불러오기 및 실시간 감시
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';

</script>


