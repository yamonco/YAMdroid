<script lang="ts">
  import ProfileListCard from '../organisms/ProfileListCard.svelte';
  import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
  import ProfileBackupBar from './ProfileBackupBar.svelte';
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
    console.log('[ProfilePage] handleEdit', idx);
    editIdx = idx;
    editName = profiles[idx]?.name ?? '';
    showEdit = true;
  }
  function handleClose() {
    console.log('[ProfilePage] handleClose');
    showEdit = false;
    editIdx = -1;
  }
  function handleSave(data: any) {
    console.log('[ProfilePage] handleSave', editIdx, data);
    onSaveProfile(editIdx, { ...data, name: editName });
    handleClose();
  }
  function handleRemove(idx: number) {
    console.log('[ProfilePage] handleRemove', idx);
    deleteIdx = idx;
    showDelete = true;
    setTimeout(() => {
      const el = document.getElementById(modalId) as HTMLInputElement;
      if (el) el.checked = true;
    }, 0);
  }
  function confirmRemove() {
    console.log('[ProfilePage] confirmRemove', deleteIdx);
    if (deleteIdx >= 0) {
      onRemoveProfile(deleteIdx);
    }
    showDelete = false;
    deleteIdx = -1;
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = false;
  }
  function cancelRemove() {
    console.log('[ProfilePage] cancelRemove');
    showDelete = false;
    deleteIdx = -1;
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = false;
  }
</script>
<div class="max-w-xl mx-auto py-6">
  <ProfileBackupBar />
  <ProfileListCard
    {profiles}
    onEdit={handleEdit}
    onRemove={handleRemove}
    onAdd={() => { console.log('[ProfilePage] onAddProfile'); onAddProfile(); }}
  />

  <!-- DaisyUI Edit Modal -->
  <input type="checkbox" id="edit-profile-modal" class="modal-toggle" bind:checked={showEdit} />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">프로필 수정</h3>
      <div class="mb-3">
        <label class="block text-xs font-medium mb-1">프로필 이름</label>
        <input class="input input-bordered w-full" bind:value={editName} />
      </div>
      {#if profiles[editIdx]}
        <ProfileConnectionForm
          value={profiles[editIdx]}
          onSave={() => handleSave(profiles[editIdx])}
        />
      {/if}
      <div class="modal-action">
        <label for="edit-profile-modal" class="btn btn-ghost btn-sm" on:click={handleClose}>닫기</label>
      </div>
    </div>
  </div>


  <!-- DaisyUI Modal -->
  <input type="checkbox" id={modalId} class="modal-toggle" bind:checked={showDelete} />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">프로필 삭제</h3>
      <p class="py-4">정말 이 프로필을 삭제하시겠습니까?</p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost btn-sm" on:click={cancelRemove}>취소</button>
        <button type="button" class="btn btn-error btn-sm" on:click={confirmRemove}>삭제</button>
      </div>
    </div>
  </div>
</div>
