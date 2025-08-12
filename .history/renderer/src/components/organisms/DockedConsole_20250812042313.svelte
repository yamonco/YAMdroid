<script lang="ts">
  // atoms/ConsoleLog 제거, 내부에서 직접 로그 출력

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
    <div class={`w-full bg-zinc-950 border border-zinc-800 shadow-lg p-2 ${minimized ? 'h-12 overflow-hidden' : 'h-64'}`} style="display: flex; flex-direction: column; height: ${minimized ? '3rem' : '16rem'}; border-radius:0; margin-bottom:0;">
      <div class="flex justify-between items-center mb-1 shrink-0">
        <span class="text-xs text-green-400 font-mono">콘솔 로그</span>
        <div class="flex gap-1">
          <Button variant="ghost" color="default" className="text-xs" onclick={onClear}>Clear</Button>
          <Button variant="ghost" color="default" className="text-xs" onclick={onMinimize}>{minimized ? '확장' : '최소화'}</Button>
        </div>
      </div>
      <div class="text-xs font-mono whitespace-pre-wrap break-all flex-1 overflow-y-auto" style="min-height:0;">
        {#each logs as log}
          <div>{log}</div>
        {/each}
      </div>
    </div>
  {/if}
  <!-- 열기 버튼 완전 제거 -->
</div>
