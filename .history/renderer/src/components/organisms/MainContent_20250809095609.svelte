<script lang="ts">
  import { onMount } from 'svelte';
  let leftW = 256, rightW = 320;
  let dragEdge: 'left' | 'right' | null = null;
  let startX = 0, startL = 256, startR = 320;

  function onMouseDown(edge: 'left' | 'right', e: MouseEvent) {
    dragEdge = edge;
    startX = e.clientX;
    startL = leftW;
    startR = rightW;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }
  function onMove(e: MouseEvent) {
    if (!dragEdge) return;
    const dx = e.clientX - startX;
    if (dragEdge === 'left') leftW = Math.min(480, Math.max(200, startL + dx));
    else rightW = Math.min(560, Math.max(220, startR - dx));
  }
  function onUp() {
    dragEdge = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }
</script>
<div class="flex h-[calc(100vh-44px)]">
  <!-- Left Sidebar -->
  <div style="width: {leftW}px" class="h-full bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col">
    <!-- 예시: 채팅 리스트 -->
    <div class="p-4 font-bold text-zinc-200">Chats</div>
    <div class="flex-1 overflow-y-auto space-y-1 px-2">
      {#each Array(10) as _, i}
        <button class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-zinc-800/60">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-purple-400/80"></span>
            <span class="text-sm text-zinc-200">Chat {i+1}</span>
          </div>
          <span class="text-[11px] text-zinc-400">{(i+1)*100} tokens</span>
        </button>
      {/each}
    </div>
  </div>
  <!-- Left Resizer -->
  <div class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700" on:mousedown={(e) => onMouseDown('left', e)} />
  <!-- Center (Chat Pane) -->
  <div class="min-w-0 flex-1 flex flex-col">
    <!-- 상단 탭 -->
    <div class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
      {#each ['Context','Model','Program'] as tab, idx}
        <button class={`px-3 py-1.5 rounded-lg text-sm border ${idx===2 ? 'border-blue-500 text-blue-300 bg-blue-500/10' : 'border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'}`}>{tab}</button>
      {/each}
    </div>
    <!-- 모델 바 -->
    <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
      <div class="flex items-center gap-2 text-zinc-300">
        <span class="rounded-lg bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-300 border border-zinc-700/60">모델 선택</span>
        <span class="text-sm">openai/gpt-oss-20b</span>
        <kbd class="rounded-md border border-zinc-700/60 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-300 shadow">Ctrl + L</kbd>
      </div>
      <button title="Eject" class="inline-flex items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-2 text-zinc-200 shadow-sm">
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-zinc-300"><path d="M12 6l8 8H4l8-8zm8 10H4v2h16v-2z"/></svg>
      </button>
    </div>
    <!-- 채팅 영역 -->
    <div class="flex-1 overflow-y-auto bg-zinc-950 p-4">
      <div class="space-y-4">
        {#each Array(5) as _, i}
          <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-200">
            <div class="mb-2 text-xs text-zinc-400">User {i+1}</div>
            <div>이곳에 채팅 메시지가 표시됩니다.</div>
          </div>
        {/each}
      </div>
    </div>
    <!-- 입력/툴바 -->
    <div class="border-t border-zinc-800 bg-zinc-900 px-4 py-2 flex items-center gap-2">
      <input class="flex-1 rounded-xl border border-zinc-700/60 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/40" placeholder="메시지 입력..." />
      <button class="inline-flex items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-2 text-zinc-200 shadow-sm">전송</button>
    </div>
  </div>
  <!-- Right Resizer -->
  <div class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700" on:mousedown={(e) => onMouseDown('right', e)} />
  <!-- Right Inspector -->
  <div style="width: {rightW}px" class="hidden xl:block h-full bg-zinc-900 border-l border-zinc-800 shrink-0 flex flex-col">
    <div class="p-4 font-bold text-zinc-200">Integrations</div>
    <div class="flex-1 overflow-y-auto space-y-2 px-2">
      {#each Array(6) as _, i}
        <div class="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-300">Integration {i+1}</div>
      {/each}
    </div>
  </div>
</div>
