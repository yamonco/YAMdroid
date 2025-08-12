<div class="flex flex-col items-center justify-center min-h-screen gap-2">
  <div class="join">
    <button class="btn join-item btn-primary btn-sm" on:click={handleExport}>백업</button>

    <label class="btn join-item btn-sm">
      복구
      <input 
        type="file" 
        accept=".json" 
        class="hidden" 
        on:change={(e) => {
          importFile = e.target.files?.[0] || null;
          if (importFile) handleImport(importFile);
        }} 
      />
    </label>
  </div>

  {#if exportMsg}<div class="text-xs text-success">{exportMsg}</div>{/if}
  {#if importMsg}<div class="text-xs text-success">{importMsg}</div>{/if}
</div>
