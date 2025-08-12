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
  class={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 ${className}`}
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
