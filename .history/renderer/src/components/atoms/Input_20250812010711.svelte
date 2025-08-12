<script lang="ts">
  export let placeholder = '';
  export let value = '';
  export let className: string = '';
  export let type: string = 'text';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let onInput: (e: Event) => void = () => {};
</script>
<input
  type={type}
  class={`w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none text-zinc-200 text-sm ${className}`}
  placeholder={placeholder}
  value={value}
  on:input={onInput}
  {...$$restProps}
/>
