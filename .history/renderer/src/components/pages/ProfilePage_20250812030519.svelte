<script lang="ts">
  import ProfileListCard from '../organisms/ProfileListCard.svelte';
  import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
  let showEdit = false;
  let editIdx = -1;
  let showDelete = false;
  let deleteIdx = -1;
  let modalId = 'delete-profile-modal';
  let editName = '';
  export let profiles = [];
  export let onAddProfile = () => {};
  export let onRemoveProfile = (idx: number) => {};
  export let onEditProfile = (idx: number) => {};
  export let onSaveProfile = (idx: number, data: any) => {};

  function handleEdit(idx: number) {
    editIdx = idx;
    editName = profiles[idx]?.name ?? '';
    showEdit = true;
  }
  function handleClose() {
    showEdit = false;
    editIdx = -1;
  }
  function handleSave(data: any) {
    onSaveProfile(editIdx, { ...data, name: editName });
    handleClose();
  }
  function handleRemove(idx: number) {
    deleteIdx = idx;
    showDelete = true;
    setTimeout(() => {
      const el = document.getElementById(modalId) as HTMLInputElement;
      if (el) el.checked = true;
    }, 0);
  }
  function confirmRemove() {
    if (deleteIdx >= 0) {
      onRemoveProfile(deleteIdx);
    }
    showDelete = false;
    deleteIdx = -1;
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = false;
  }
  function cancelRemove() {
    showDelete = false;
    deleteIdx = -1;
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = false;
  }
</script>
<div class="max-w-xl mx-auto py-6">
  <ProfileListCard
    {profiles}
    onEdit={handleEdit}
    onRemove={handleRemove}
    onAdd={onAddProfile}
  />

  {#if showEdit && profiles[editIdx]}
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-md">
        <div class="mb-3">
          <label class="block text-xs font-medium mb-1">프로필 이름</label>
          <input class="input input-bordered w-full" bind:value={editName} />
        </div>
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


  <!-- DaisyUI Modal -->
  <input type="checkbox" id={modalId} class="modal-toggle" bind:checked={showDelete} />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">프로필 삭제</h3>
      <p class="py-4">정말 이 프로필을 삭제하시겠습니까?</p>
      <div class="modal-action">
        <label for={modalId} class="btn btn-ghost btn-sm" on:click={cancelRemove}>취소</label>
        <label for={modalId} class="btn btn-error btn-sm" on:click={confirmRemove}>삭제</label>
      </div>
    </div>
  </div>
</div>
