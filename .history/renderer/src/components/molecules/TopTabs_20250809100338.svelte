<script lang="ts">
  export let tabs: string[] = [];
  export let activeIdx: number = 0;
  export let onTab: (idx: number) => void = () => {};
</script>
<div class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
  {#each tabs as tab, idx}
    <button
      class={`px-3 py-1.5 rounded-lg text-sm border ${idx===activeIdx ? 'border-blue-500 text-blue-300 bg-blue-500/10' : 'border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'}`}
      on:click={() => onTab(idx)}
    >{tab}</button>
  {/each}
</div>
