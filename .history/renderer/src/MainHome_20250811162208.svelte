<script lang="ts">
  let scrcpyFolders: string[] = [];
  let selected: string = '';
  let loading = false;
  let showSaved = false;

  async function loadFolders() {
    loading = true;
    scrcpyFolders = await window.bridge.scanScrcpyFolders();
    loading = false;
  }

  function selectFolder(folder: string) {
    selected = folder;
    showSaved = false;
  }

  function saveSelection() {
    showSaved = true;
    // TODO: 실제 저장 로직 필요시 구현 (예: localStorage, IPC 등)
  }

  $: if (scrcpyFolders.length === 0 && !loading) loadFolders();
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
  <div class="w-full max-w-md bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-6 text-center">SCRCPY 경로 선택</h1>
    {#if loading}
      <div class="mb-4">폴더 검색 중...</div>
    {:else if scrcpyFolders.length === 0}
      <div class="mb-4 text-red-400 text-center">
        SCRCPY 폴더가 없습니다.<br>
        <span class="text-zinc-300">아래와 같이 폴더 구조를 만들어주세요:</span>
        <pre class="bg-zinc-950 border border-zinc-700 rounded p-3 mt-2 text-xs text-zinc-200 text-left select-text">
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
      <div class="mb-4 w-full">
        <label for="scrcpy-folder-select" class="block mb-2 font-medium">SCRCPY 버전 폴더를 선택하세요:</label>
        <select id="scrcpy-folder-select" class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" bind:value={selected}>
          <option value="" disabled selected>폴더 선택...</option>
          {#each scrcpyFolders as folder}
            <option value={folder}>{folder}</option>
          {/each}
        </select>
      </div>
      {#if selected}
        <div class="mb-4 w-full flex flex-col items-center">
          <div class="text-green-400 mb-2">선택된 경로:</div>
          <div class="font-mono bg-zinc-800 rounded px-3 py-1 text-zinc-100 text-sm">{selected}</div>
          <button class="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition" on:click={saveSelection}>저장</button>
          {#if showSaved}
            <div class="mt-2 text-blue-400 text-sm">경로가 저장되었습니다!</div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</div>
