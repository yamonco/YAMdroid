<script lang="ts">
// ProfileCardMolecule: 개별 프로필 카드(이름, 삭제버튼 등)
export let name: string = '';
export let active: boolean = false;
export let onSelect: () => void = () => {};
export let onRemove: (() => void) | null = null;
</script>

<div class={`flex items-center gap-1 rounded px-2 py-1 border ${active ? 'border-primary bg-primary/10 text-primary' : 'border-base-300 bg-base-100 text-base-content'}`}>
  <button type="button" class="btn btn-xs btn-ghost px-2" on:click={onSelect}>{name}</button>
  {#if onRemove}
    <button type="button" class="btn btn-xs btn-ghost text-error" title="삭제" on:click={onRemove}>
      🗑
    </button>
  {/if}
</div>
