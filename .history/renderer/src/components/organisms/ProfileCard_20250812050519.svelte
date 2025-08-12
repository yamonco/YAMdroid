<script lang="ts">


  // import { toast } from '../stores/toast'; // adjust path as needed

  // Define the Profile type
type Profile = {
    name?: string;
    [key: string]: any;
};

export let profiles: Profile[] = [];
export let activeProfileIdx: number = 0;
export let newProfileName: string = '';
export let showSaved: boolean = false;
export let runError: string = '';
export let onAddProfile: () => void = () => {};
export let onRemoveProfile: (idx: number) => void = (idx: number) => {};
export let onSelectProfile: (idx: number) => void = (idx: number) => {};
export let onUpdateProfileField: (idx: number, field: string, value: any) => void = (idx: number, field: string, value: any) => {};
export let onSaveProfile: () => void = () => {};
export let onNewProfileNameInput: (e: Event) => void = (e: Event) => {};

// Toast notifications
// $: if (showSaved) {
//     toast.success('프로필이 저장되었습니다!');
// }
// $: if (runError) {
//     toast.error(runError);
// }
</script>

<div class="w-full bg-base-200 rounded-lg p-4 border border-base-300 flex flex-col gap-2 mb-4">
<div class="font-semibold text-primary text-xs mb-1 flex items-center gap-2">
    <span>프로필 설정 (카테고리별)</span>
</div>
<div class="flex gap-2 flex-wrap mb-2">
            {#each profiles as p, idx}
                <!-- ProfileCardMolecule 자리 (공백) -->
            {/each}
        {/each}
    <input
        class="input input-xs input-bordered w-24"
        placeholder="새 프로필명"
        value={newProfileName}
        on:input={onNewProfileNameInput}
        on:keydown={(e) => { if (e.key === 'Enter') onAddProfile(); }}
    />
    <button class="btn btn-xs btn-success" type="button" on:click={onAddProfile}>＋</button>
</div>
<ProfileManager
    profiles={profiles.map((p, idx) => ({ ...p, name: p.name ?? `프로필${idx + 1}` }))}
    {activeProfileIdx}
    on:updateProfileField={e => onUpdateProfileField(e.detail.idx, e.detail.field, e.detail.value)}
/>
/>
<div class="w-full flex gap-2 mt-2">
    <button
        class="btn btn-primary flex-1 px-4 py-2 text-xs font-semibold"
        type="button"
        on:click={onSaveProfile}
    >
        프로필 저장
    </button>
</div>
{#if showSaved}
    <div class="mt-1 text-info text-xs">프로필이 저장되었습니다!</div>
{/if}
{#if runError}
    <div class="mt-1 text-error text-xs">{runError}</div>
{/if}
</div>
