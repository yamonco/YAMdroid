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

<div class="w-full flex flex-col items-center justify-end pt-2 pb-0 bg-transparent" style="position:absolute;left:0;right:0;bottom:0;z-index:50;">
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
