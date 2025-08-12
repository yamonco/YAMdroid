<script lang="ts">
  export let options: { label: string; value: string }[] = [];
  export let value: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let className: string = '';
  export let onChange: (e: Event) => void = () => {};
  export let id: string = '';
  export let name: string = '';
</script>

<select
  id={id}
  name={name}
  class={`w-full rounded-xl px-3 py-2 border border-zinc-300 bg-white/80 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 dark:bg-zinc-900/70 dark:text-zinc-100 dark:border-zinc-700/60 transition-colors duration-200 ${className}`}
  bind:value
  disabled={disabled}
  on:change={onChange}
>
  {#if placeholder}
    <option value="" disabled selected={value === ''}>{placeholder}</option>
  {/if}
  {#each options as opt}
    <option value={opt.value}>{opt.label}</option>
  {/each}
</select>
