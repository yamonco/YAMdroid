<script lang="ts">

import ProfileListCard from '../organisms/ProfileListCard.svelte';
import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
import ProfileBackupBar from '../molecules/ProfileBackupBar.svelte';

// props: 외부에서 반드시 주입받는 값/함수만 export let으로 선언
export let profiles: any[] = [];
export let activeProfileId: number;
export let newProfileName: string;
export let onSelectProfile: (idx: number) => void;
export let onAddProfile: () => void;
export let onRemoveProfile: (idx: number) => void;
export let onSaveProfile: (idx: number, data: any) => void;
export let onNewProfileNameInput: (v: string) => void;
export let toast: any;
export let activeTab: string;
export let onTabChange: (tab: string) => void;
export let deviceForm: any;
export let videoForm: any;
export let onDeviceFormChange: (field: string, value: any) => void;
export let onVideoFormChange: (field: string, value: any) => void;
export let onDeviceFormSave: () => void;
export let onVideoFormSave: () => void;

let showEdit = false;
let editIdx = -1;
let showDelete = false;
let deleteIdx = -1;
let modalId = 'delete-profile-modal';
let editName = '';



// Svelte 5 스타일: 함수 바인딩/이벤트 전달을 props 함수로 바로 연결
const handleEdit = (idx: number) => {
  editIdx = idx;
  editName = profiles[idx]?.name ?? '';
  showEdit = true;
};
const handleClose = () => {
  showEdit = false;
  editIdx = -1;
};
const handleSave = (data: any) => {
  onSaveProfile(editIdx, { ...data, name: editName });
  handleClose();
};
const handleRemove = (idx: number) => {
  deleteIdx = idx;
  showDelete = true;
  setTimeout(() => {
    const el = document.getElementById(modalId) as HTMLInputElement;
    if (el) el.checked = true;
  }, 0);
};
const confirmRemove = () => {
  if (deleteIdx >= 0) {
    onRemoveProfile(deleteIdx);
  }
  showDelete = false;
  deleteIdx = -1;
  const el = document.getElementById(modalId) as HTMLInputElement;
  if (el) el.checked = false;
};
const cancelRemove = () => {
  showDelete = false;
  deleteIdx = -1;
  const el = document.getElementById(modalId) as HTMLInputElement;
  if (el) el.checked = false;
};
</script>
<div class="max-w-xl mx-auto py-6">
  <ProfileBackupBar />

  <ProfileListCard
    {profiles}
    onEdit={handleEdit}
    onRemove={handleRemove}
    onAdd={onAddProfile}
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
