<script lang="ts">
  import ConsoleLog from '../atoms/ConsoleLog.svelte';
  import Button from '../atoms/Button.svelte';
  export let logs = [];
  export let show = false;
  export let minimized = false;
  export let onClear = () => {};
  export let onClose = () => {};
  export let onMinimize = () => {};
  export let onOpen = () => {};
</script>

<div class="fixed left-0 right-0 bottom-0 z-50 w-full">
  <ConsoleLog
    {logs}
    {show}
    {minimized}
    onClear={onClear}
    onClose={onClose}
    onMinimize={onMinimize}
  />
  {#if !show}
    <div class="flex justify-end p-2">
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
