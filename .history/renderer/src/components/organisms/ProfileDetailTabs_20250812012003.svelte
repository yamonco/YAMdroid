<script lang="ts">
  // 아토믹: 상태/이벤트는 상위에서 주입, UI만 담당
  export let activeTab: 'device' | 'video' = 'device';
  export let onTabChange: (tab: 'device' | 'video') => void = () => {};
</script>
<div class="flex gap-2 border-b border-gray-200 dark:border-gray-800">
  <button
    class="px-4 py-2 -mb-px rounded-t-md text-sm transition {activeTab === 'device' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
    on:click={() => onTabChange('device')}
  >
    연결/디바이스
  </button>
  <button
    class="px-4 py-2 -mb-px rounded-t-md text-sm transition {activeTab === 'video' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
    on:click={() => onTabChange('video')}
  >
    비디오 출력
  </button>
</div>
