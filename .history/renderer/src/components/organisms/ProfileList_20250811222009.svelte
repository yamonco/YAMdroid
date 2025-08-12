<script lang="ts">
  export type Profile = {
    name: string;
    device: string;
    resolution: string;
    dpi: string;
  };
  export let profiles: Profile[] = [];
  export let activeIdx: number = 0;
  export let onSelect: (idx: number) => void;
  export let onAdd: (name: string) => void;
  export let onRemove: (idx: number) => void;
  export let onFieldChange: (field: keyof Profile, value: string) => void;
  export let newProfileName: string = '';
  export let setNewProfileName: (v: string) => void;
</script>

<div class="w-full mb-6">
  <div class="flex items-center gap-2 mb-2">
    <span class="font-semibold">프로필 목록</span>
    <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" bind:value={newProfileName} oninput={e => setNewProfileName((e.target as HTMLInputElement).value)} />
    <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" onclick={() => onAdd(newProfileName)} disabled={!newProfileName.trim()}>추가</button>
  </div>
  <div class="flex flex-wrap gap-2 mb-4">
    {#each profiles as profile, idx}
      <button class={`px-3 py-1 rounded border ${idx === activeIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`} onclick={() => onSelect(idx)}>{profile.name}</button>
      {#if profiles.length > 1}
        <button class="text-xs text-red-400 cursor-pointer bg-transparent border-0" onclick={() => onRemove(idx)} aria-label="프로필 삭제">✕</button>
      {/if}
    {/each}
  </div>
  <div class="bg-zinc-900 rounded-lg p-4 border border-zinc-700 mb-2">
    <div class="mb-2 font-semibold text-blue-400">프로필 설정</div>
    <input class="mb-2 w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" value={profiles[activeIdx].device} oninput={e => onFieldChange('device', (e.target as HTMLInputElement).value)} />
    <input class="mb-2 w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" value={profiles[activeIdx].resolution} oninput={e => onFieldChange('resolution', (e.target as HTMLInputElement).value)} />
    <input class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" value={profiles[activeIdx].dpi} oninput={e => onFieldChange('dpi', (e.target as HTMLInputElement).value)} />
  </div>
</div>
