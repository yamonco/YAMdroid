<script lang="ts">
import { exportProfilesTo, importProfilesFrom } from '../../lib/features/profiles';
let exportFile: File | null = null;
let importFile: File | null = null;
let exportMsg = '';
let importMsg = '';
const defaultExportName = 'profiles-backup.json';

async function handleExport() {
  if (!exportFile) return;
  try {
    await exportProfilesTo(exportFile.path || exportFile.name);
    exportMsg = '백업 완료!';
  } catch (e) {
    exportMsg = '백업 실패: ' + e;
  }
}
async function handleImport() {
  if (!importFile) return;
  try {
    await importProfilesFrom(importFile.path || importFile.name);
    importMsg = '복구 완료! 새로고침 해주세요.';
  } catch (e) {
    importMsg = '복구 실패: ' + e;
  }
}
</script>
<div class="flex gap-4 my-4 flex-wrap">
  <!-- 내보내기 카드 -->
  <div class="card bg-base-100 w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">프로필 내보내기(백업)</h2>
      <p class="text-xs mb-2">백업 파일을 저장할 경로와 이름을 선택하세요.</p>
      <input
        type="file"
        class="file-input file-input-bordered w-full"
        accept=".json"
        on:change={e => {
          exportFile = e.target.files[0];
          if (exportFile) handleExport();
        }}
      />
      <div class="text-xs mt-1 opacity-60">기본 파일명: <span class="font-mono">{defaultExportName}</span></div>
      {#if exportMsg}<div class="text-xs text-success mt-2">{exportMsg}</div>{/if}
    </div>
  </div>
  <!-- 불러오기 카드 -->
  <div class="card bg-base-100 w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">프로필 불러오기(복구)</h2>
      <p class="text-xs mb-2">복구할 백업 파일(.json)을 선택하세요.</p>
      <input
        type="file"
        class="file-input file-input-bordered w-full"
        accept=".json"
        on:change={e => {
          importFile = e.target.files[0];
          if (importFile) handleImport();
        }}
      />
      {#if importMsg}<div class="text-xs text-success mt-2">{importMsg}</div>{/if}
    </div>
  </div>
</div>
