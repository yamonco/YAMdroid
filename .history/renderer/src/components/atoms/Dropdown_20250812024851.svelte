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
  class={`select select-bordered w-full ${className}`}
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
