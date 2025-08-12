<script lang="ts">
  let scrcpyFolders: string[] = [];
  let selected: string = '';
  let loading = false;

  async function loadFolders() {
    loading = true;
    scrcpyFolders = await window.bridge.scanScrcpyFolders();
    loading = false;
  }

  function selectFolder(folder: string) {
    selected = folder;
  }

  $: if (scrcpyFolders.length === 0 && !loading) loadFolders();
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200">
  <h1 class="text-2xl font-bold mb-6">SCRCPY 경로 선택</h1>
  {#if loading}
    <div class="mb-4">폴더 검색 중...</div>
  {:else if scrcpyFolders.length === 0}
    <div class="mb-4 text-red-400">
      SCRCPY 폴더가 없습니다.<br>
      <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
      <pre class="bg-zinc-900 border border-zinc-700 rounded p-3 mt-2 text-xs text-zinc-200 text-left select-text">
resources/
  scrcpy/
    scrcpy-win64-v3.3/
      scrcpy.exe
    scrcpy-win64-v3.3.1/
      scrcpy.exe
      ...
      </pre>
      <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
    </div>
  {:else}
    <div class="mb-4 w-80">
      <label class="block mb-2">SCRCPY 버전 폴더를 선택하세요:</label>
      <select class="w-full p-2 rounded bg-zinc-900 border border-zinc-700" bind:value={selected}>
        <option value="" disabled selected>폴더 선택...</option>
        {#each scrcpyFolders as folder}
          <option value={folder}>{folder}</option>
        {/each}
      </select>
    </div>
    {#if selected}
      <div class="mb-4 text-green-400">선택된 경로: <span class="font-mono">{selected}</span></div>
    {/if}
  {/if}
</div>
