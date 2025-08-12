<script lang="ts">
  export let logs: string[] = [];
  export let onClear: () => void = () => {};
  export let show: boolean = true;
  export let minimized: boolean = false;
  export let onClose: () => void = () => {};
  export let onMinimize: () => void = () => {};

</script>

{#if show}
<div class="w-full shadow-2xl rounded-t-xl border border-zinc-700 bg-zinc-950 text-zinc-200 flex flex-col-reverse justify-end min-w-[320px] max-w-[100vw]" style="margin:0 auto;{minimized ? 'height:40px' : 'height:320px'};">
  <!-- 드래그바 -->
  <div class="flex items-center justify-between bg-zinc-900 rounded-t-xl px-3 py-2 select-none" role="toolbar">
    <span class="font-semibold text-green-400 text-xs">SCRCPY 콘솔 로그</span>
    <div class="flex gap-1">
      <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400" title="최소화" on:click={onMinimize}>{minimized ? '🔼' : '🔽'}</button>
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
