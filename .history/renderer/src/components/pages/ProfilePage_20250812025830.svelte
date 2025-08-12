<script lang="ts">
  import ProfileListCard from '../organisms/ProfileListCard.svelte';
  import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
  let showEdit = false;
  let editIdx = -1;
  export let profiles = [];
  export let onAddProfile = () => {};
  export let onRemoveProfile = (idx: number) => {};
  export let onEditProfile = (idx: number) => {};
  export let onSaveProfile = (idx: number, data: any) => {};

  function handleEdit(idx: number) {
    editIdx = idx;
    showEdit = true;
  }
  function handleClose() {
    showEdit = false;
    editIdx = -1;
  }
  function handleSave(data: any) {
    onSaveProfile(editIdx, data);
    handleClose();
  }
</script>
<div class="max-w-xl mx-auto py-6">
  <ProfileListCard
    {profiles}
    onEdit={handleEdit}
    onRemove={onRemoveProfile}
    onAdd={onAddProfile}
  />

  {#if showEdit && profiles[editIdx]}
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-md">
        <ProfileConnectionForm
          value={profiles[editIdx]}
          onChange={(field, value) => {
            profiles[editIdx] = { ...profiles[editIdx], [field]: value };
          }}
          onSave={() => handleSave(profiles[editIdx])}
        />
        <div class="flex justify-end mt-2">
          <button class="btn btn-ghost btn-sm" on:click={handleClose}>닫기</button>
        </div>
      </div>
    </div>
  {/if}
</div>
