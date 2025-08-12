
<script lang="ts">
import Input from '../atoms/Input.svelte';
import { getScrcpyRoot, setScrcpyRoot } from '../../lib/features/scrcpy/scrcpy.config';
let scrcpyRoot = $state('');

$effect(() => {
  scrcpyRoot = getScrcpyRoot();
});

function handleSave() {
  setScrcpyRoot(scrcpyRoot);
  alert('SCRCPY 경로가 저장되었습니다.');
}
</script>

<div class="p-6 text-zinc-200">
  <h2 class="text-lg font-bold mb-4">설정</h2>
  <div class="mb-6">
    <div class="font-semibold mb-2">SCRCPY 루트 경로</div>
    <Input
      class="w-full mb-2"
      placeholder="예: D:/work/YAMdroidNew/resources/scrcpy"
      bind:value={scrcpyRoot}
    />
    <button
      class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
      onclick={handleSave}
      disabled={!scrcpyRoot.trim()}
    >
      경로 저장
    </button>
    <div class="text-xs text-zinc-400 mt-2">scrcpy.exe가 포함된 폴더의 상위 경로를 지정하세요.</div>
  </div>
  <div class="mb-2">테마: <span class="font-mono">Synthwave</span></div>
  <div class="mb-2">기타 옵션은 추후 추가 예정</div>
</div>
