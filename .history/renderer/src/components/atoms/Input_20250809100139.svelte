<script lang="ts">
  export let placeholder = '';
  export let value = '';
  export let className = '';
  export let onInput: (e: Event) => void = () => {};
</script>
<input
  class={`w-full rounded-xl border border-zinc-700/60 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/40 ${className}`}
  placeholder={placeholder}
  value={value}
  on:input={onInput}
/>
