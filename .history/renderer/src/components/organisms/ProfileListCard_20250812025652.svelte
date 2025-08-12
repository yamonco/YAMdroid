<script lang="ts">
  export let profiles: any[] = [];
  export let onEdit: (idx: number) => void = () => {};
  export let onRemove: (idx: number) => void = () => {};
  export let onAdd: () => void = () => {};
</script>
<div class="flex flex-col gap-2">
  {#each profiles as profile, idx}
    <div class="flex items-center bg-base-200 rounded-xl shadow p-3 group transition border border-base-300">
      <div class="flex-1 flex flex-col">
        <div class="font-semibold text-base-content">{profile.name}</div>
        {#if profile.desc}
          <div class="text-xs text-base-content/60">{profile.desc}</div>
        {/if}
      </div>
      <div class="flex items-center gap-1 ml-2">
        <button class="btn btn-ghost btn-xs" on:click={() => onEdit(idx)}>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3h3z" /></svg>
        </button>
        <button class="btn btn-ghost btn-xs" on:click={() => onRemove(idx)}>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  {/each}
  <button class="btn btn-primary btn-sm mt-2 self-start" on:click={onAdd}>
    + 프로필 추가
  </button>
</div>
