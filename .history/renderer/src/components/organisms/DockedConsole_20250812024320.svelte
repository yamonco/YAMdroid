<script lang="ts">
  // atoms/ConsoleLog 제거, 내부에서 직접 로그 출력
  import Button from '../atoms/Button.svelte';
  export let logs: string[] = [];
  export let show: boolean = false;
  export let minimized: boolean = false;
  export let onClear: () => void = () => {};
  export let onClose: () => void = () => {};
  export let onMinimize: () => void = () => {};
  export let onOpen: () => void = () => {};
</script>

<div class="w-full flex flex-col-reverse items-center justify-end pt-2 pb-0 bg-transparent">
  {#if show}
    <div class={`w-full bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg p-2 mb-2 ${minimized ? 'h-12 overflow-hidden' : 'h-64 overflow-y-auto'}`}>
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs text-green-400 font-mono">콘솔 로그</span>
        <div class="flex gap-1">
          <Button variant="ghost" color="default" className="text-xs" onclick={onClear}>Clear</Button>
          <Button variant="ghost" color="default" className="text-xs" onclick={onMinimize}>{minimized ? '확장' : '최소화'}</Button>
          <Button variant="ghost" color="danger" className="text-xs" onclick={onClose}>닫기</Button>
        </div>
      </div>
      <div class="text-xs font-mono whitespace-pre-wrap break-all h-full overflow-y-auto">
        {#each logs as log}
          <div>{log}</div>
        {/each}
      </div>
    </div>
  {/if}
  {#if !show}
    <div class="flex justify-end p-2 w-full">
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
