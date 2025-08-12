<script lang="ts">
import ProfileListCard from '../molecules/ProfileListCard.svelte';
import ProfileConnectionForm from '../molecules/ProfileConnectionForm.svelte';

export let profiles: any[] = [];
export let onEdit: (idx: number) => void = () => {};
export let onRemove: (idx: number) => void = () => {};
export let onAdd: () => void = () => {};
export let editIdx: number = -1;
export let editProfile: any = null;
export let onProfileChange: (field: string, value: any) => void = () => {};
export let onProfileSave: () => void = () => {};
</script>

<div class="flex flex-col gap-4">
  <ProfileListCard {profiles} onEdit={onEdit} onRemove={onRemove} onAdd={onAdd} />
  {#if editIdx >= 0 && editProfile}
    <div class="card bg-base-100 shadow p-4">
      <ProfileConnectionForm value={editProfile} onChange={onProfileChange} onSave={onProfileSave} />
    </div>
  {/if}
</div>
