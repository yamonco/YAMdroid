<script>
  export let toggleMenu;
</script>

<div class="drawer-side z-40">
  <label for="side-menu" class="drawer-overlay" on:click={toggleMenu}></label>
  <aside class="menu p-4 w-64 min-h-full bg-base-100 text-base-content">
    <h2 class="text-xl font-bold mb-4">유틸리티  메뉴</h2>
    <ul>
      <li><a class="active">SCRCPY 번들</a></li>
      <!-- 추후 메뉴 추가 가능 -->
    </ul>
  </aside>
</div>
