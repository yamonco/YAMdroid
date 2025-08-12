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
  <div style="width: {leftW}px" class="h-full"><slot name="left" /></div>
  <div class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700" role="separator" tabindex="0" on:mousedown={(e) => onMouseDown('left', e)}></div>
  <div class="min-w-0 flex-1"><slot name="center" /></div>
  <div class="w-1 cursor-col-resize bg-zinc-800/80 hover:bg-zinc-700" role="separator" tabindex="0" on:mousedown={(e) => onMouseDown('right', e)}></div>
  <div style="width: {rightW}px" class="hidden xl:block h-full"><slot name="right" /></div>
</div>
