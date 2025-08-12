<script lang="ts">
  export let profiles: any[] = [];
  export let onEdit: (idx: number) => void = () => {};
  export let onRemove: (idx: number) => void = () => {};
  export let onAdd: () => void = () => {};
</script>

<ul class="list bg-base-100 rounded-box shadow-md">
  <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">프로필 목록</li>
  {#each profiles as profile, idx}
    <li class="list-row flex items-center gap-3 px-4 py-2 border-b border-base-200 last:border-b-0">
      <div class="flex-1 min-w-0">
        <div class="list-item-title font-semibold truncate">{profile.name}</div>
        {#if profile.desc}
          <div class="list-item-desc text-xs opacity-60 truncate">{profile.desc}</div>
        {/if}
      </div>
      <button class="btn btn-square btn-ghost" on:click={() => onEdit(idx)} aria-label="수정">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="2" d="M16.862 3.487a2.07 2.07 0 0 1 2.93 2.93L7.5 18.707l-4 1 1-4L16.862 3.487Z"/><path stroke="currentColor" stroke-width="2" d="M15 5 19 9"/></svg>
      </button>
      <button class="btn btn-square btn-ghost" on:click={() => onRemove(idx)} aria-label="삭제">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </li>
  {/each}
  <li class="px-4 py-2">
    <button class="btn btn-primary btn-sm w-full" on:click={onAdd}>
      + 프로필 추가
    </button>
  </li>
</ul>
