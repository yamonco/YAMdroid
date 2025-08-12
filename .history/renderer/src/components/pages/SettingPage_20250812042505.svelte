
<script lang="ts">

import { getScrcpyRoot, setScrcpyRoot } from '../../lib/features/scrcpy/scrcpy.config';
import { loadFolders } from '../../lib/features/scrcpy/scrcpy.actions';
let scrcpyFolders = $state<string[]>([]);
let selectedFolder = $state('');

$effect(() => {
  (async () => {
    scrcpyFolders = await loadFolders();
    const saved = getScrcpyRoot();
    if (saved && scrcpyFolders.includes(saved)) {
      selectedFolder = saved;
    } else if (scrcpyFolders.length > 0) {
      selectedFolder = scrcpyFolders[0];
    }
  })();
});

function handleSave() {
  setScrcpyRoot(selectedFolder);
  alert('SCRCPY 경로가 저장되었습니다.');
}
</script>

<div class="p-6">
  <h2 class="text-lg font-bold mb-4">설정</h2>
  <div class="mb-6">
    <div class="font-semibold mb-2">SCRCPY 폴더 선택</div>
    <select
        bind:value={selectedFolder}
        class="mb-2"
    >
        <option value="" disabled selected>폴더 선택...</option>
        {#each scrcpyFolders as folder}
            <option value={folder}>{folder}</option>
        {/each}
    </select>
    />
    <button
      class="btn btn-primary btn-sm"
      onclick={handleSave}
      disabled={!selectedFolder}
    >
      경로 저장
    </button>
    <div class="text-xs mt-2">scrcpy.exe가 포함된 폴더를 선택하세요.</div>
  </div>
  <div class="mb-2">테마: <span class="font-mono">Synthwave</span></div>
  <div class="mb-2">기타 옵션은 추후 추가 예정</div>
</div>
