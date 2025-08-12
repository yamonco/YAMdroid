<script lang="ts">
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let value: string = '';
  export let className: string = '';
  export let onChange: (e: Event) => void = () => {};
</script>

<input
  type="checkbox"
  id={id}
  name={name}
  value={value}
  class={`h-4 w-4 accent-blue-600 rounded border border-zinc-400 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-colors duration-200 ${className}`}
  checked={checked}
  disabled={disabled}
  on:change={onChange}
/>
