<script lang="ts">
  // 프로필 관리용 상태
  type Profile = {
    name: string;
    device: string;
    resolution: string;
    dpi: string;
  };
  let profiles: Profile[] = [
    { name: '기본 프로필', device: '', resolution: '', dpi: '' }
  ];
  let activeProfileIdx = 0;
  let newProfileName = '';

  function addProfile() {
    if (newProfileName.trim()) {
      profiles = [...profiles, { name: newProfileName, device: '', resolution: '', dpi: '' }];
      newProfileName = '';
      activeProfileIdx = profiles.length - 1;
    }
  }
  function removeProfile(idx: number) {
    if (profiles.length === 1) return;
    profiles = profiles.filter((_, i) => i !== idx);
    if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
  }
  function selectProfile(idx: number) {
    activeProfileIdx = idx;
  }
  function updateProfileField(field: keyof Profile, value: string) {
    profiles[activeProfileIdx] = { ...profiles[activeProfileIdx], [field]: value };
    profiles = [...profiles];
  }
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
  <div class="w-full max-w-lg bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-800 flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-6 text-center">SCRCPY 프로필 관리</h1>
    <!-- SCRCPY 경로 선택 -->
    <div class="w-full mb-8">
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
    scrcpy-win64-v3.3.1/
      scrcpy.exe
      ...
          </pre>
          <span class="text-zinc-400">scrcpy.exe가 반드시 각 버전 폴더 안에 존재해야 합니다.</span>
        </div>
      {:else}
        <select id="scrcpy-folder-select" class="w-full p-2 rounded bg-zinc-950 border border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none" bind:value={selected}>
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

    <!-- 프로필 목록 및 관리 -->
    <div class="w-full mb-6">
      <div class="flex items-center mb-2">
        <span class="font-semibold">프로필 목록</span>
        <input class="ml-4 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-sm w-32" placeholder="새 프로필명" bind:value={newProfileName} on:keydown={(e) => e.key === 'Enter' && addProfile()} />
        <button class="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold" on:click={addProfile}>추가</button>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each profiles as profile, idx}
          <button class={`px-3 py-1 rounded-lg border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`} on:click={() => selectProfile(idx)}>{profile.name}
            {#if profiles.length > 1}
              <span class="ml-1 text-xs text-red-400 cursor-pointer" on:click|stopPropagation={() => removeProfile(idx)}>✕</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- 선택된 프로필 상세 설정 -->
    <div class="w-full mb-4 bg-zinc-950 rounded-lg p-4 border border-zinc-800">
      <div class="mb-2 font-semibold text-blue-300">프로필 설정</div>
      <div class="flex flex-col gap-2">
        <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm" placeholder="기기명 (예: Galaxy S23)" bind:value={profiles[activeProfileIdx].device} on:input={(e) => updateProfileField('device', e.target.value)} />
        <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm" placeholder="해상도 (예: 1080x2400)" bind:value={profiles[activeProfileIdx].resolution} on:input={(e) => updateProfileField('resolution', e.target.value)} />
        <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm" placeholder="DPI (예: 420)" bind:value={profiles[activeProfileIdx].dpi} on:input={(e) => updateProfileField('dpi', e.target.value)} />
      </div>
    </div>

    <button class="w-full mt-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition" on:click={saveSelection}>프로필 저장</button>
    {#if showSaved}
      <div class="mt-2 text-blue-400 text-sm">프로필이 저장되었습니다!</div>
    {/if}
  </div>
</div>
