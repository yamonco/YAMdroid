<script lang="ts">
  import ProfileManager from '../organisms/ProfileManager.svelte';
  import ProfileDetailTabs from '../organisms/ProfileDetailTabs.svelte';
  import ProfileDeviceForm from '../organisms/ProfileDeviceForm.svelte';
  import ProfileVideoForm from '../organisms/ProfileVideoForm.svelte';
  import ProfileConnectionForm from '../organisms/ProfileConnectionForm.svelte';
  export let profiles = [];
  export let activeProfileId: number = 0;
  export let newProfileName = '';
  export let onSelectProfile = (idx: number) => {};
  export let onAddProfile = () => {};
  export let onNewProfileNameInput = (v: string) => {};
  export let onSaveProfile = () => {};
  export let toast = null;
  export let activeTab: 'device' | 'video' = 'device';
  export let onTabChange = (tab: 'device' | 'video') => {};
  export let deviceForm = {};
  export let videoForm = {};
  export let onDeviceFormChange = (field: string, value: any) => {};
  export let onVideoFormChange = (field: string, value: any) => {};
  export let onDeviceFormSave = () => {};
  export let onVideoFormSave = () => {};
</script>
<div class="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
  <section>
    <ProfileManager
      {profiles}
      {activeProfileId}
      {newProfileName}
      {onSelectProfile}
      {onAddProfile}
      {onNewProfileNameInput}
      {onSaveProfile}
      {toast}
    />
  </section>
  <section class="space-y-6">
    <ProfileDetailTabs {activeTab} {onTabChange} />
    {#if activeTab === 'device'}
      <ProfileConnectionForm
        value={deviceForm}
        onChange={onDeviceFormChange}
        onSave={onDeviceFormSave}
      />
    {:else}
      <ProfileVideoForm {...videoForm} onChange={onVideoFormChange} onSave={onVideoFormSave} />
    {/if}
  </section>
</div>
