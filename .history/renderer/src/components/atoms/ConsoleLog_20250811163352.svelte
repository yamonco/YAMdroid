<script lang="ts">
  export let logs: string[] = [];
  export let onClear: () => void = () => {};
</script>
<div class="w-full mt-8">
  <div class="flex items-center justify-between mb-2">
    <span class="font-semibold text-zinc-300">SCRCPY 콘솔 로그</span>
    <button class="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700" on:click={onClear}>로그 초기화</button>
  </div>
  <div class="h-40 overflow-y-auto bg-black text-green-300 rounded p-2 text-xs font-mono border border-zinc-700 whitespace-pre-line" style="min-height:3rem;">
    {#if logs.length === 0}
      <span class="text-zinc-500">로그가 없습니다.</span>
    {:else}
      {#each logs as log}
        {log}
      {/each}
    {/if}
  </div>
</div>
