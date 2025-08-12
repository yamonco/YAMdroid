
<script lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getProfiles, setProfiles } from '@/lib/features/profiles/profiles.actions';
import { onMount } from 'svelte';
import ScrcpySessionList from '../organisms/ScrcpySessionList.svelte';
import { refreshSessions, setSessionForeground, killSession } from '@/lib/features/scrcpy/scrcpy.actions';
import type { ScrcpySession } from '$lib/features/scrcpy/scrcpy.types';

import ProfileListCard from '../molecules/ProfileListCard.svelte';
import ProfileConnectionForm from '../molecules/ProfileConnectionForm.svelte';
import ProfileBackupBar from '../molecules/ProfileBackupBar.svelte';

// 폼데이터: ProfilePage에서만 관리
let profiles = [];
onMount(async () => {
  profiles = await getProfiles();
  loadSessions();
  // 세션 변경 이벤트 리스너 등록 (실시간 반영)
  if (window.scrcpyLog && window.scrcpyLog.on) {
    window.scrcpyLog.on(() => loadSessions());
  }
  if (window.bridge && window.bridge.onScrcpySessionUpdate) {
    window.bridge.onScrcpySessionUpdate(() => loadSessions());
  }
});
let newProfileName = '';
let showEdit = false;
let editIdx = -1;
let showDelete = false;
let deleteIdx = -1;
let modalId = 'delete-profile-modal';
let editName = '';

let sessions: ScrcpySession[] = [];
async function loadSessions() {
  sessions = [...await refreshSessions()];
}
async function handleToggleForeground(session: ScrcpySession) {
  await setSessionForeground(session, !session.foreground);
  await loadSessions();
}
async function handleKill(session: ScrcpySession) {
  await killSession(session);
  await loadSessions();
}

async function handleAddProfile() {
  if (!newProfileName.trim()) return;
  profiles = [
    ...profiles,
    {
      id: uuidv4(),
      name: newProfileName.trim(),
      usb: false,
      tcpip: false,
      forceAdb: false,
      serial: '',
      addr: '',
      portRange: '',
      host: '',
      port: '',
    }
  ];
  newProfileName = '';
  await setProfiles(profiles);
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
async function handleSave(data) {
  // id는 유지, 나머지 값 갱신
  const old = profiles[editIdx] || {};
  profiles[editIdx] = {
    ...old,
    ...data,
    name: editName,
    id: old.id || uuidv4(),
  };
  profiles = [...profiles];
  await setProfiles(profiles);
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
async function confirmRemove() {
  if (deleteIdx >= 0) {
    profiles.splice(deleteIdx, 1);
    profiles = [...profiles];
    await setProfiles(profiles);
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
    onAdd={handleAddProfile}
    onPlay={async (idx) => {
      const p = profiles[idx];
      // SCRCPY 실행: 설정에서 저장한 scrcpy 폴더 사용
      const scrcpyFolder = localStorage.getItem('scrcpyRoot') || '';
      if (!scrcpyFolder) {
        alert('SCRCPY 경로가 설정되어 있지 않습니다. 설정 페이지에서 SCRCPY 폴더를 먼저 선택/저장하세요.');
        return;
      }
      await window.bridge.runScrcpy({
        folder: scrcpyFolder,
        device: p.device || '',
        resolution: p.resolution || '',
        dpi: p.dpi || ''
      });
    }}
  />


  <div class="flex gap-2 mb-4">
    <input
      class="input input-bordered flex-1"
      placeholder="새 프로필명"
      bind:value={newProfileName}
      on:keydown={(e) => { if (e.key === 'Enter') handleAddProfile(); }}
    />
    <button class="btn btn-primary" on:click={handleAddProfile}>+ 추가</button>
  </div>
  
  <ProfileBackupBar />

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
          onChange={async (field, value) => {
            profiles[editIdx] = { ...profiles[editIdx], [field]: value };
            profiles = [...profiles];
            await setProfiles(profiles);
          }}
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
