<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import Input from '../atoms/Input.svelte';
  import ProfileManager from './ProfileManager.svelte';
  export let profiles = [];
  export let activeProfileIdx = 0;
  export let newProfileName = '';
  export let showSaved = false;
  export let runError = '';
  export let onAddProfile = () => {};
  export let onRemoveProfile = (idx: number) => {};
  export let onSelectProfile = (idx: number) => {};
  export let onUpdateProfileField = (idx: number, field: string, value: any) => {};
  export let onSaveProfile = () => {};
  export let onNewProfileNameInput = (e: any) => {};
</script>

<div class="w-full bg-zinc-950 rounded-lg p-4 border border-zinc-800 flex flex-col gap-2 mb-4">
  <div class="font-semibold text-blue-300 text-xs mb-1 flex items-center gap-2">
    <span>프로필 설정 (카테고리별)</span>
  </div>
  <div class="flex gap-2 flex-wrap mb-2">
    {#each profiles as p, idx}
      <Button
        className={`px-2 py-1 rounded border text-xs${idx === activeProfileIdx ? ' selected' : ''}`}
        onclick={() => onSelectProfile(idx)}
      >{p.name || `프로필${idx + 1}`}</Button>
      <Button
        title="삭제"
        disabled={profiles.length <= 1}
        className="text-red-400 text-xs"
        onclick={() => onRemoveProfile(idx)}
      >🗑️</Button>
    {/each}
    <Input
      className="px-1 py-0.5 border rounded text-xs w-24"
      placeholder="새 프로필명"
      value={newProfileName}
      onInput={onNewProfileNameInput}
      onkeydown={(e) => { if (e.key === 'Enter') onAddProfile(); }}
    />
    <Button className="text-green-400 text-xs" onclick={onAddProfile}>＋</Button>
  </div>
  <ProfileManager
    {profiles}
    {activeProfileIdx}
    onUpdateProfileField={onUpdateProfileField}
  />
  <div class="w-full flex gap-2 mt-2">
    <Button
      className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
      onclick={onSaveProfile}
    >
      프로필 저장
    </Button>
  </div>
  {#if showSaved}
    <div class="mt-1 text-blue-400 text-xs">프로필이 저장되었습니다!</div>
  {/if}
  {#if runError}
    <div class="mt-1 text-red-400 text-xs">{runError}</div>
  {/if}
</div>
