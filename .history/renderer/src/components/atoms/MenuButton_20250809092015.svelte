<script>
  export let toggleMenu;
</script>

<!-- md 이하에서만 노출되는 메뉴 버튼 -->
<button class="btn btn-ghost md:hidden m-2 w-fit" on:click={toggleMenu}>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
  메뉴
</button>
