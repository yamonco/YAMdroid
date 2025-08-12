<script lang="ts">

  export let label: string = '';
  export let value: string = '';
  export let placeholder: string = '';
  export let onInput: (e: Event) => void;
  // 고유 id 생성 (label-for 연결)
  const inputId = `input-${Math.random().toString(36).slice(2, 10)}`;
</script>
<div class="flex flex-col gap-1">
  <label class="text-xs font-medium" for={inputId}>{label}</label>
  <Input id={inputId} {placeholder} {value} onInput={onInput} size="sm" />
</div>
