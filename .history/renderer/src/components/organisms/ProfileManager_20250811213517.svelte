<script lang="ts">
  export let profiles = [];
  export let activeProfileIdx = 0;
  export let newProfileName = '';
  export let onAddProfile;
  export let onRemoveProfile;
  export let onSelectProfile;
  export let onUpdateProfileField;
</script>

<section class="w-full flex flex-col gap-2 mb-4">
  <div class="flex items-center gap-2 mb-1">
    <span class="font-semibold text-sm">프로필 목록</span>
    <input class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28" placeholder="새 프로필명" bind:value={newProfileName} on:keydown={(e) => e.key === 'Enter' && onAddProfile()} />
    <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" on:click={onAddProfile}>추가</button>
  </div>
  <div class="flex flex-wrap gap-2">
    {#each profiles as profile, idx}
      <div class="flex items-center gap-1">
        <button class={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`} on:click={() => onSelectProfile(idx)}>{profile.name}</button>
        {#if profiles.length > 1}
          <button type="button" class="text-xs text-red-400 cursor-pointer bg-transparent border-0" on:click={() => onRemoveProfile(idx)} aria-label="프로필 삭제">✕</button>
        {/if}
      </div>
    {/each}
  </div>
</section>

<section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
  <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정</div>
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="기기명 (예: Galaxy S23)" bind:value={profiles[activeProfileIdx].device} on:input={(e) => onUpdateProfileField('device', (e.target as HTMLInputElement)?.value || '')} />
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="해상도 (예: 1080x2400)" bind:value={profiles[activeProfileIdx].resolution} on:input={(e) => onUpdateProfileField('resolution', (e.target as HTMLInputElement)?.value || '')} />
  <input class="px-3 py-2 rounded bg-zinc-900 border border-zinc-700 text-xs" placeholder="DPI (예: 420)" bind:value={profiles[activeProfileIdx].dpi} on:input={(e) => onUpdateProfileField('dpi', (e.target as HTMLInputElement)?.value || '')} />
</section>
