<script lang="ts">
</script>
<div class="h-full bg-zinc-900 border-l border-zinc-800 shrink-0 flex flex-col" style="width: 320px;">
  <div class="p-4 font-bold text-zinc-200">Integrations</div>
  <div class="flex-1 overflow-y-auto space-y-2 px-2">
    {#each Array(6) as _, i}
      <div class="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-300">Integration {i+1}</div>
    {/each}
  </div>
</div>
