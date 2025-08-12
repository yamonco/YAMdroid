<script lang="ts">
  let leftW = 256, rightW = 320;
  let dragEdge: 'left' | 'right' | null = null;
  let startX = 0, startL = 256, startR = 320;
  function onMouseDown(edge: 'left' | 'right', e: MouseEvent) {
    dragEdge = edge;
    startX = e.clientX;
    startL = leftW;
    startR = rightW;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }
  function onMove(e: MouseEvent) {
    if (!dragEdge) return;
    const dx = e.clientX - startX;
    if (dragEdge === 'left') leftW = Math.min(480, Math.max(200, startL + dx));
    else rightW = Math.min(560, Math.max(220, startR - dx));
  }
  function onUp() {
    dragEdge = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }
</script>
<div class="flex h-full">
  <div style="width: {leftW}px; min-width: 200px;" class="h-full overflow-visible z-10"><slot name="left" /></div>
  <div
    class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700"
    role="separator"
    aria-orientation="vertical"
    on:mousedown={(e) => onMouseDown('left', e)}
    on:keydown={(e) => { if (e.key === 'ArrowLeft') leftW = Math.max(200, leftW - 16); if (e.key === 'ArrowRight') leftW = Math.min(480, leftW + 16); }}
    tabindex="-1"
  ></div>
  <div class="min-w-0 flex-1"><slot name="center" /></div>
  <div
    class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700"
    role="separator"
    aria-orientation="vertical"
    on:mousedown={(e) => onMouseDown('right', e)}
    on:keydown={(e) => { if (e.key === 'ArrowLeft') rightW = Math.min(560, rightW + 16); if (e.key === 'ArrowRight') rightW = Math.max(220, rightW - 16); }}
    tabindex="-1"
  ></div>
  <div style="width: {rightW}px" class="hidden xl:block h-full"><slot name="right" /></div>
</div>
