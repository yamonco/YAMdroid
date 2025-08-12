<script lang="ts">
  export let label: string = '';
  export let value: string = '';
  export let placeholder: string = '';
  export let onInput: (e: Event) => void;
</script>
<div class="flex flex-col gap-1">
  <label class="text-xs font-medium">{label}</label>
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" {placeholder} bind:value={value} on:input={onInput} />
</div>
