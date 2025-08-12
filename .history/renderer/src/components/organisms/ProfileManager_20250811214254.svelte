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

<section class="w-full flex flex-col gap-2 mb-4">
  <div class="flex items-center gap-2 mb-1">
    <span class="font-semibold text-sm">프로필 목록</span>
    <LabeledInput
      label=""
      placeholder="새 프로필명"
      value={newProfileName}
      onInput={(e) => { newProfileName = e.target.value; }}
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

<section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
  <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정</div>
  <LabeledInput
    label="기기명"
    placeholder="기기명 (예: Galaxy S23)"
    value={profiles[activeProfileIdx].device}
    onInput={(e) => onUpdateProfileField('device', e.target.value)}
  />
  <LabeledInput
    label="해상도"
    placeholder="해상도 (예: 1080x2400)"
    value={profiles[activeProfileIdx].resolution}
    onInput={(e) => onUpdateProfileField('resolution', e.target.value)}
  />
  <LabeledInput
    label="DPI"
    placeholder="DPI (예: 420)"
    value={profiles[activeProfileIdx].dpi}
    onInput={(e) => onUpdateProfileField('dpi', e.target.value)}
  />
</section>
