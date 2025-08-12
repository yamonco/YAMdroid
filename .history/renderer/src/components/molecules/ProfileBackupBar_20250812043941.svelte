<script lang="ts">
import { exportProfilesTo, importProfilesFrom } from '../../lib/features/profiles';
let showExport = false;
let showImport = false;
let exportPath = '';
let importPath = '';
let exportMsg = '';
let importMsg = '';

async function handleExport() {
  try {
    await exportProfilesTo(exportPath);
    exportMsg = '백업 완료!';
  } catch (e) {
    exportMsg = '백업 실패: ' + e;
  }
}
async function handleImport() {
  try {
    await importProfilesFrom(importPath);
    importMsg = '복구 완료! 새로고침 해주세요.';
  } catch (e) {
    importMsg = '복구 실패: ' + e;
  }
}
</script>
<div class="flex gap-2 my-4">
  <div class="flex flex-col">
    <label class="text-xs mb-1" for="export-path">프로필 내보내기(백업)</label>
    <input id="export-path" class="input input-bordered input-sm" placeholder="경로/파일명.json" bind:value={exportPath} />
    <button class="btn btn-primary btn-xs mt-1" on:click={handleExport}>내보내기</button>
    {#if exportMsg}<div class="text-xs text-success mt-1">{exportMsg}</div>{/if}
  </div>
  <div class="flex flex-col">
    <label class="text-xs mb-1" for="import-path">프로필 불러오기(복구)</label>
    <input id="import-path" class="input input-bordered input-sm" placeholder="경로/파일명.json" bind:value={importPath} />
    <button class="btn btn-secondary btn-xs mt-1" on:click={handleImport}>불러오기</button>
    {#if importMsg}<div class="text-xs text-success mt-1">{importMsg}</div>{/if}
  </div>
</div>
