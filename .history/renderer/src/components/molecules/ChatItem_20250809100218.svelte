<script lang="ts">
  export let active = false;
  export let title = '';
  export let tokens = 0;
</script>
<button class={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${active ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/60'}`}>
  <div class="flex items-center gap-2">
    <span class="h-2.5 w-2.5 rounded-full bg-purple-400/80"></span>
    <span class="text-sm text-zinc-200">{title}</span>
  </div>
  <span class="text-[11px] text-zinc-400">{tokens} tokens</span>
</button>
