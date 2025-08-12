<script lang="ts">
import BaseButton from '../atoms/BaseButton.svelte';
import LabeledInput from '../molecules/LabeledInput.svelte';
export let profiles = [];
export let activeProfileIdx = 0;
export let newProfileName = '';
export let onAddProfile;
export let onRemoveProfile;
export let onSelectProfile;
export let onUpdateProfileField;
</script>

<section class="w-full flex flex-col gap-2 mb-4 bg-zinc-950 rounded-lg p-4 border border-zinc-800">
  <div class="flex items-center gap-2 mb-1">
    <span class="font-semibold text-sm">프로필 목록</span>
    <LabeledInput
      label=""
      placeholder="새 프로필명"
      value={newProfileName}
      onInput={(e) => { onUpdateProfileField('newProfileName', e.target.value); }}
    />
    <BaseButton className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" on:click={onAddProfile}>추가</BaseButton>
  </div>
  <div class="flex flex-wrap gap-2">
    {#each profiles as profile, idx}
      <div class="flex items-center gap-1">
        <BaseButton
          className={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
          on:click={() => onSelectProfile(idx)}
        >{profile.name}</BaseButton>
        {#if profiles.length > 1}
          <BaseButton type="button" className="text-xs text-red-400 cursor-pointer bg-transparent border-0" on:click={() => onRemoveProfile(idx)} aria-label="프로필 삭제">✕</BaseButton>
        {/if}
      </div>
    {/each}
  </div>
</section>
