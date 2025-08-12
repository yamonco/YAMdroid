<script lang="ts">
  // 아토믹: 상태/이벤트는 상위에서 주입, UI만 담당
  export let encoder: string = '';
  export let bitrate: string = '';
  export let fps: string = '';
  export let res: string = '';
  export let onChange: (field: string, value: any) => void = () => {};
  export let onSave: () => void = () => {};
</script>
<div class="space-y-6">
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">비디오 출력</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">인코더</span>
        <select value={encoder} on:change={e => onChange('encoder', e.target.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="H264">H264</option>
          <option value="H265">H265</option>
          <option value="AV1">AV1</option>
        </select>
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">비트레이트(kbps)</span>
        <input value={bitrate} on:input={e => onChange('bitrate', e.target.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">FPS</span>
        <input value={fps} on:input={e => onChange('fps', e.target.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">해상도</span>
        <input value={res} on:input={e => onChange('res', e.target.value)} placeholder="1920x1080" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
    </div>
  </div>
  <div class="flex justify-end">
    <button on:click={onSave} class="h-10 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
      저장
    </button>
  </div>
</div>
