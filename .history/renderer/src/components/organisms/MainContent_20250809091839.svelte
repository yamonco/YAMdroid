<script>
  let scrcpyFolders = [];
  let scanned = false;
  let menuOpen = false;

  async function scanScrcpy() {
    scanned = false;
    scrcpyFolders = [];
    if (window.bridge?.scanScrcpyFolders) {
      scrcpyFolders = await window.bridge.scanScrcpyFolders();
    }
    scanned = true;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<div class="min-h-screen bg-base-200 flex">
  <!-- 사이드 메뉴 (md 이하에서만 노출, 접기/펼치기) -->
  <div class="drawer md:drawer-open">
    <input id="side-menu" type="checkbox" class="drawer-toggle" bind:checked={menuOpen} />
    <div class="drawer-content flex flex-col">
      <!-- 메뉴 버튼 (md 이하에서만) -->
      <button class="btn btn-ghost md:hidden m-2 w-fit" on:click={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        메뉴
      </button>
      <!-- 메인 컨텐츠 -->
      <div class="p-4">
        <div class="max-w-2xl mx-auto">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">SCRCPY 번들 스캔</h2>
              <p>resources/scrcpy 하위 폴더에서 scrcpy.exe가 존재하는 폴더를 스캔합니다.</p>
              <div class="card-actions justify-end">
                <button class="btn btn-info" type="button" on:click={scanScrcpy}>스캔</button>
              </div>
              {#if scrcpyFolders.length > 0}
                <ul class="mt-4">
                  {#each scrcpyFolders as folder}
                    <li class="badge badge-outline mr-2 mb-2">{folder}</li>
                  {/each}
                </ul>
              {:else if scanned}
                <div class="text-sm text-gray-400 mt-4">검색 결과가 없습니다.</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-side z-40">
      <label for="side-menu" class="drawer-overlay" on:click={toggleMenu}></label>
      <aside class="menu p-4 w-64 min-h-full bg-base-100 text-base-content">
        <h2 class="text-xl font-bold mb-4">유틸리티 메뉴</h2>
        <ul>
          <li><a class="active">SCRCPY 번들</a></li>
          <!-- 추후 메뉴 추가 가능 -->
        </ul>
      </aside>
    </div>
  </div>
</div>
