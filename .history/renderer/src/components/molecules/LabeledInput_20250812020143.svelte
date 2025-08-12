<script lang="ts">
  import Input from '../atoms/Input.svelte';
  export let label: string = '';
  export let value: string = '';
  export let placeholder: string = '';
  export let onInput: (e: Event) => void;
</script>
<div class="flex flex-col gap-1">
  <label class="text-xs font-medium">{label}</label>
  <Input {placeholder} {value} onInput={onInput} size="sm" />
</div>
