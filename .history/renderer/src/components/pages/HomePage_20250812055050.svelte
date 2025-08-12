
<script lang="ts">
  import { onMount } from 'svelte';
  import ScrcpySessionList from '../organisms/ScrcpySessionList.svelte';
  import ProfilePage from '../organisms/ProfilePage.svelte';
  import { refreshSessions, setSessionForeground, killSession } from '@/lib/features/scrcpy/scrcpy.actions';
  import type { ScrcpySession } from '@/lib/features/scrcpy/scrcpy.types';

  let sessions: ScrcpySession[] = [];
  async function loadSessions() {
    sessions = [...await refreshSessions()];
  }
  onMount(() => {
    loadSessions();
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

<div class="flex w-full h-[80vh] gap-6">
  <!-- 왼쪽: 프로필 관리/실행 -->
  <div class="flex-1 min-w-[340px] max-w-[420px] border-r border-base-200 pr-6 overflow-y-auto">
    <ProfilePage />
  </div>
  <!-- 오른쪽: 세션 목록 -->
  <div class="flex-1 min-w-[340px] pl-6 overflow-y-auto">
    <h2 class="text-lg font-bold mb-4">실행 중인 SCRCPY 세션</h2>
    <ScrcpySessionList
      {sessions}
      onToggleForeground={handleToggleForeground}
      onKill={handleKill}
    />
    {#if sessions.length === 0}
      <div class="mt-10 text-center text-zinc-400 opacity-70">
        <div class="text-3xl mb-2">😴</div>
        <div>실행 중인 세션이 없습니다.<br>프로필에서 ▶ 실행을 눌러주세요.</div>
      </div>
    {/if}
  </div>
</div>
