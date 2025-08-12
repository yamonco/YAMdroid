<script lang="ts">
import { exportProfilesTo, importProfilesFrom } from '../../lib/features/profiles';

let importFile: File | null = null;
let exportMsg = '';
let importMsg = '';
const defaultExportName = 'profiles-backup.json';

async function handleExport() {
  try {
    const result = await window.bridge?.showSaveDialog?.({
      title: '프로필 백업 파일 저장',
      defaultPath: defaultExportName,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    const filePath = result?.filePath || result;
    if (!filePath || result?.canceled) return;
    await exportProfilesTo(filePath);
    exportMsg = '백업 완료!';
  } catch (e) {
    exportMsg = '백업 실패: ' + e;
  }
}

async function handleImport(file: File) {
  try {
    await importProfilesFrom(file.path || file.name);
    importMsg = '복구 완료! 새로고침 해주세요.';
  } catch (e) {
    importMsg = '복구 실패: ' + e;
  }
}
</script>

<div class="join my-4">
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

{#if exportMsg}<div class="text-xs text-success mt-1">{exportMsg}</div>{/if}
{#if importMsg}<div class="text-xs text-success mt-1">{importMsg}</div>{/if}
