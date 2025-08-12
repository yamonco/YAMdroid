<script lang="ts">

import ProfileListCard from '../organisms/ProfileListCard.svelte';
import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
import ProfileBackupBar from '../molecules/ProfileBackupBar.svelte';

// 폼데이터: ProfilePage에서만 관리
let profiles = [];
let newProfileName = '';
let showEdit = false;
let editIdx = -1;
let showDelete = false;
let deleteIdx = -1;
let modalId = 'delete-profile-modal';
let editName = '';

function handleAddProfile() {
  if (!newProfileName.trim()) return;
  profiles = [...profiles, { name: newProfileName.trim() }];
  newProfileName = '';
}
function handleEdit(idx) {
  editIdx = idx;
  editName = profiles[idx]?.name ?? '';
  showEdit = true;
}
function handleClose() {
  showEdit = false;
  editIdx = -1;
}
function handleSave(data) {
  profiles[editIdx] = { ...data, name: editName };
  profiles = [...profiles];
  handleClose();
}
function handleRemove(idx) {
  deleteIdx = idx;
  showDelete = true;
  setTimeout(() => {
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = true;
  }, 0);
}
function confirmRemove() {
  if (deleteIdx >= 0) {
    profiles.splice(deleteIdx, 1);
    profiles = [...profiles];
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

  <ProfileBackupBar />

  <div class="flex gap-2 mb-4">
    <input
      class="input input-bordered flex-1"
      placeholder="새 프로필명"
      bind:value={newProfileName}
      on:keydown={(e) => { if (e.key === 'Enter') handleAddProfile(); }}
    />
    <button class="btn btn-primary" on:click={handleAddProfile}>+ 추가</button>
  </div>

  <ProfileListCard
    {profiles}
    onEdit={handleEdit}
    onRemove={handleRemove}
    onAdd={handleAddProfile}
  />

  <!-- DaisyUI Edit Modal -->
  <input type="checkbox" id="edit-profile-modal" class="modal-toggle" bind:checked={showEdit} />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">프로필 수정</h3>
      <div class="mb-3">
        <label class="block text-xs font-medium mb-1" for="profile-edit-name">프로필 이름</label>
        <input id="profile-edit-name" class="input input-bordered w-full" bind:value={editName} />
      </div>
      {#if profiles[editIdx]}
        <ProfileConnectionForm
          value={profiles[editIdx]}
          onSave={() => handleSave(profiles[editIdx])}
        />
      {/if}
      <div class="modal-action">
        <button type="button" class="btn btn-ghost btn-sm" on:click={handleClose}>닫기</button>
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
