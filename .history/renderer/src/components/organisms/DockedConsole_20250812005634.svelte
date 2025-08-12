<script lang="ts">
  import ConsoleLog from '../atoms/ConsoleLog.svelte';
  import Button from '../atoms/Button.svelte';
  export let logs: string[] = [];
  export let show: boolean = false;
  export let minimized: boolean = false;
  export let onClear: () => void = () => {};
  export let onClose: () => void = () => {};
  export let onMinimize: () => void = () => {};
  export let onOpen: () => void = () => {};
</script>

<div class="w-full flex flex-col items-center justify-end pt-2 pb-0 bg-transparent">
  <ConsoleLog
    {logs}
    {show}
    {minimized}
    onClear={onClear}
    onClose={onClose}
    onMinimize={onMinimize}
  />
  {#if !show}
    <div class="flex justify-end p-2 w-full max-w-2xl mx-auto">
      <Button
        variant="ghost"
        color="success"
        className="px-4 py-2 rounded-full shadow-lg"
        onclick={onOpen}
      >
        콘솔 열기
      </Button>
    </div>
  {/if}
</div>
