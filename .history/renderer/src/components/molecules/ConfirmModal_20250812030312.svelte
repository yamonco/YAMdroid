<script lang="ts">
  export let open = false;
  export let title = '';
  export let message = '';
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>
{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-base-100 rounded-xl shadow-lg p-6 w-full max-w-xs">
      <div class="font-bold text-lg mb-2">{title}</div>
      <div class="mb-4">{message}</div>
      <div class="flex justify-end gap-2">
        <button class="btn btn-ghost btn-sm" on:click={onCancel}>취소</button>
        <button class="btn btn-error btn-sm" on:click={onConfirm}>삭제</button>
      </div>
    </div>
  </div>
{/if}
