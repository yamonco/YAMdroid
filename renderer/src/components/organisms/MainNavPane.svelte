<script lang="ts">
  export let active: string = 'chat';
  export let onSelect: (id: string) => void = () => {};
  import { HomeIcon, CogIcon, InfoIcon } from '../icons';
  const navs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'setting', icon: CogIcon, label: 'Setting' },
    { id: 'about', icon: InfoIcon, label: 'About' },
  ];
</script>
<nav class="flex flex-col items-center gap-2 py-4 bg-zinc-950 border-r border-zinc-800 min-h-0 h-full w-14">
  {#each navs as nav}
    <button
      class="w-10 h-10 flex items-center justify-center rounded-lg mb-1 transition {active === nav.id ? 'bg-base-200' : 'hover:bg-base-300'}"
      aria-label={nav.label}
      on:click={() => onSelect(nav.id)}
    >
      <svelte:component this={nav.icon} />
    </button>
  {/each}
</nav>
