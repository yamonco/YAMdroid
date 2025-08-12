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

  // ▼ 추가: 좌패널 리사이즈 상태와 핸들러
  let leftWidth = 380;            // 초기 픽셀 폭
  let isResizing = false;
  let startX = 0;
  let startWidth = 380;

  function onResizeStart(e: PointerEvent) {
    isResizing = true;
    startX = e.clientX;
    startWidth = leftWidth;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onResizeMove(e: PointerEvent) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    // 범위 제한(필요 시 값 조정)
    const min = 300, max = 600;
    let w = startWidth + dx;
    if (w < min) w = min;
    if (w > max) w = max;
    leftWidth = w;
  }

  function onResizeEnd(e: PointerEvent) {
    isResizing = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }

  function resetWidth() {
    leftWidth = 380; // 더블클릭 초기화
  }
</script>

<div class="flex w-full h-[80vh] items-stretch">
  <!-- 왼쪽: 프로필 관리/실행 -->
  <div class="shrink-0 overflow-y-auto pr-4" style={`width:${leftWidth}px`}>
    <ProfilePage />
  </div>
  <!-- 리사이즈 바 -->
  <div
    class="w-[6px] mx-1 cursor-col-resize bg-base-200 hover:bg-base-300 active:bg-base-300 rounded"
    on:pointerdown={onResizeStart}
    on:pointermove={onResizeMove}
    on:pointerup={onResizeEnd}
    on:pointercancel={onResizeEnd}
    on:dblclick={resetWidth}
  />
  <!-- 오른쪽: 세션 목록 -->
  <div class="flex-1 min-w-[340px] pl-2 overflow-y-auto">

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
