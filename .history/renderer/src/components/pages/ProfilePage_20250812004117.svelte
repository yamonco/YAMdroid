<script lang="ts">
  import ProfileCard from '../organisms/ProfileCard.svelte';
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

<div class="w-full flex flex-col items-center">
  <ProfileCard
    {profiles}
    {activeProfileIdx}
    {newProfileName}
    {showSaved}
    {runError}
    onAddProfile={onAddProfile}
    onRemoveProfile={onRemoveProfile}
    onSelectProfile={onSelectProfile}
    onUpdateProfileField={onUpdateProfileField}
    onSaveProfile={onSaveProfile}
    onNewProfileNameInput={onNewProfileNameInput}
  />
</div>
