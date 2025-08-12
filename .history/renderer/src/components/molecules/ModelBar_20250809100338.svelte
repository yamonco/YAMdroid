<script lang="ts">
  export let model = '';
</script>
<div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
  <div class="flex items-center gap-2 text-zinc-300">
    <span class="rounded-lg bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-300 border border-zinc-700/60">모델 선택</span>
    <span class="text-sm">{model}</span>
    <slot name="kbd" />
  </div>
  <slot name="action" />
</div>
