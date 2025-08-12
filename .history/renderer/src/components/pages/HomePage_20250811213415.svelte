<script lang="ts">
  // 페이지 단위에서 필요한 props/state만 관리
  export let scrcpyFolders: string[] = [];
  export let selected: string = '';
  export let loading: boolean = false;
  export let onSelectFolder: (folder: string) => void;
</script>

<div class="bg-zinc-900 rounded-xl shadow p-5 border border-zinc-800 mb-4">
  <h2 class="text-lg font-bold mb-3 text-blue-400">SCRCPY 폴더 선택</h2>
  <label for="scrcpy-folder-select" class="block mb-2 font-medium">SCRCPY 버전 폴더 선택</label>
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
      adb.exe
      ...
      </pre>
      <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
    </div>
  {:else}
    <select id="scrcpy-folder-select" class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" bind:value={selected} on:change={(e) => onSelectFolder(e.target.value)}>
      <option value="" disabled selected>폴더 선택...</option>
      {#each scrcpyFolders as folder}
        <option value={folder}>{folder}</option>
      {/each}
    </select>
    {#if selected}
      <div class="mt-2 text-green-400 text-sm">선택된 경로: <span class="font-mono">{selected}</span></div>
    {/if}
  {/if}
</div>
