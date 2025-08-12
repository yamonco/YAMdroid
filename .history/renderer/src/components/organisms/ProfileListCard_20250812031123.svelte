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
        <button class="btn btn-ghost btn-xs" on:click={() => onEdit(idx)} aria-label="수정">
          <span class="[&>svg]:w-4 [&>svg]:h-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="inline-block" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="2" d="M16.862 3.487a2.07 2.07 0 0 1 2.93 2.93L7.5 18.707l-4 1 1-4L16.862 3.487Z"/><path stroke="currentColor" stroke-width="2" d="M15 5 19 9"/></svg>
          </span>
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
