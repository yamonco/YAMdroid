<script lang="ts">
  export let active: string = 'chat';
  export let onSelect: (id: string) => void = () => {};
  const navs = [
    { id: 'chat', icon: '💬', color: 'text-yellow-400', label: '채팅' },
    { id: 'terminal', icon: '⌨️', color: 'text-green-400', label: '터미널' },
    { id: 'files', icon: '📁', color: 'text-red-400', label: '파일' },
    { id: 'search', icon: '🔍', color: 'text-blue-400', label: '검색' },
  ];
</script>
<nav class="flex flex-col items-center gap-2 py-4 bg-zinc-950 border-r border-zinc-800 min-h-0 h-full w-14">
  {#each navs as nav}
    <button
      class="w-10 h-10 flex items-center justify-center rounded-lg mb-1 transition {nav.color} {active === nav.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}"
      aria-label={nav.label}
      on:click={() => onSelect(nav.id)}
    >
      <span class="text-xl">{nav.icon}</span>
    </button>
  {/each}
</nav>
