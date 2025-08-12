
<script lang="ts">
  import { onMount } from 'svelte';
  import ScrcpySessionList from '../organisms/ScrcpySessionList.svelte';
  import { refreshSessions, setSessionForeground, killSession } from '$lib/features/scrcpy/scrcpy.actions';
  import type { ScrcpySession } from '$lib/features/scrcpy/scrcpy.types';

  // 페이지 단위에서 필요한 props/state만 관리
  export let scrcpyFolders: string[] = [];
  export let selected: string = '';
  export let loading: boolean = false;
  export let onSelectFolder: (folder: string) => void;

  let sessions: ScrcpySession[] = [];

  async function loadSessions() {
    sessions = [...await refreshSessions()];
  }

  onMount(() => {
    loadSessions();
    // 세션 변경 이벤트 리스너 등록 (실시간 반영)
    if (window.scrcpyLog && window.scrcpyLog.on) {
      window.scrcpyLog.on(() => loadSessions());
    }
    if (window.bridge && window.bridge.onScrcpySessionUpdate) {
      window.bridge.onScrcpySessionUpdate(() => loadSessions());
    }
  });

  async function handleToggleForeground(session: ScrcpySession) {
    await setSessionForeground(session, !session.foreground);
    await loadSessions();
  }
  async function handleKill(session: ScrcpySession) {
    await killSession(session);
    await loadSessions();
  }
</script>


<ScrcpySessionList
  {sessions}
  onToggleForeground={handleToggleForeground}
  onKill={handleKill}
/>
