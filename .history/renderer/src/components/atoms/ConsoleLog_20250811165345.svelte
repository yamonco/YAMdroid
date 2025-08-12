<script lang="ts">
  export let logs: string[] = [];
  export let onClear: () => void = () => {};
  export let show: boolean = true;
  export let minimized: boolean = false;
  export let onClose: () => void = () => {};
  export let onMinimize: () => void = () => {};
  let drag = false;
  let offset = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };
  function onDragStart(e: MouseEvent) {
    drag = true;
    offset = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  }
  function onDragMove(e: MouseEvent) {
    if (!drag) return;
    pos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
  }
  function onDragEnd() {
    drag = false;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  }
</script>

{#if show}
<div class="fixed z-50 shadow-2xl rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-200 flex flex-col min-w-[320px] max-w-[90vw]" style="right:24px;bottom:24px;width:400px;{minimized ? 'height:40px' : 'height:320px'};transform:translate({pos.x}px,{pos.y}px);">
  <!-- 드래그바 -->
  <div class="flex items-center justify-between cursor-move bg-zinc-900 rounded-t-xl px-3 py-2 select-none" on:mousedown={onDragStart}>
    <span class="font-semibold text-green-400 text-xs">SCRCPY 콘솔 로그</span>
    <div class="flex gap-1">
      <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400" title="최소화" on:click={onMinimize}>{minimized ? '🔼' : '🔽'}</button>
      <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 text-red-400" title="닫기" on:click={onClose}>✕</button>
    </div>
  </div>
  {#if !minimized}
    <div class="flex-1 overflow-y-auto bg-black text-green-300 rounded-b-xl p-2 text-xs font-mono whitespace-pre-line" style="min-height:3rem;max-height:220px;">
      {#if logs.length === 0}
        <span class="text-zinc-500">로그가 없습니다.</span>
      {:else}
        {#each logs as log}
          {log}
        {/each}
      {/if}
    </div>
    <div class="flex justify-end p-2">
      <button class="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700" on:click={onClear}>로그 초기화</button>
    </div>
  {/if}
</div>
{/if}
