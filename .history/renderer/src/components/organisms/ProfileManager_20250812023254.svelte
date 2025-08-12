<script lang="ts">

export let profiles = [];
export let activeProfileIdx = 0;
export let onSelectProfile = (idx) => {};
export let onAddProfile = () => {};
export let onRemoveProfile = (idx) => {};
export let newProfileName = '';
export let onNewProfileNameInput = (v) => {};
</script>




<section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
  <div class="font-semibold text-blue-300 text-xs mb-1">프로필 목록</div>
  <div class="flex gap-2 mb-2">
    <input
      class="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs w-28"
      placeholder="새 프로필명"
      bind:value={newProfileName}
      on:input={e => onNewProfileNameInput(e.target.value)}
    />
    <button
      class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
      on:click={onAddProfile}
      disabled={!newProfileName.trim()}
    >
      추가
    </button>
  </div>
  <div class="flex flex-wrap gap-2 mb-2">
    {#each profiles as profile, idx}
      <button
        class={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
        on:click={() => onSelectProfile(idx)}
      >
        {profile.name}
      </button>
      {#if profiles.length > 1}
        <button
          class="text-xs text-red-400 cursor-pointer bg-transparent border-0"
          on:click={() => onRemoveProfile(idx)}
          aria-label="프로필 삭제"
        >
          ×
        </button>
      {/if}
    {/each}
  </div>
</section>
