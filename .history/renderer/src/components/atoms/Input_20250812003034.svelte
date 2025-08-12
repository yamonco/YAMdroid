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
  class={`
    w-full rounded border outline-none transition
    bg-zinc-900 text-zinc-200 placeholder-zinc-500
    border-zinc-700/60 focus:ring-2 focus:ring-blue-500/40
    ${size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-3 py-2 text-sm'}
    ${className}
  `}
  placeholder={placeholder}
  value={value}
  on:input={onInput}
  {...$$restProps}
/>
