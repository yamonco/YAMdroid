<script>
  let scrcpyFolders = [];
  let scanned = false;
  let activeMenu = 'scrcpy';

  async function scanScrcpy() {
    scanned = false;
    scrcpyFolders = [];
    if (window.bridge?.scanScrcpyFolders) {
      scrcpyFolders = await window.bridge.scanScrcpyFolders();
    }
    scanned = true;
  }

  function setMenu(menu) {
    activeMenu = menu;
  }
</script>

<div class="min-h-screen flex flex-col bg-base-200">
  <!-- 상단 네비게이션 바 -->
  <div class="navbar bg-neutral text-neutral-content shadow-md z-10">
    <div class="flex-1">
      <span class="ml-2 font-bold text-lg tracking-wide">YAMdroid Helper</span>
    </div>
    <div class="flex-none gap-2 mr-2">
      <button class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      </button>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=yamdroid" />
          </div>
        </label>
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li><a>프로필</a></li>
          <li><a>설정</a></li>
          <li><a>로그아웃</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="flex flex-1 min-h-0">
    <!-- 좌측 사이드바 -->
    <aside class="w-20 md:w-56 bg-neutral text-neutral-content flex flex-col items-center py-4 shadow-lg">
      <nav class="flex flex-col gap-2 w-full items-center">
        <button class="btn btn-ghost w-16 h-16 md:w-full md:h-12 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 rounded-none"
          class:btn-active={activeMenu === 'scrcpy'}
          on:click={() => setMenu('scrcpy')}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h4" /></svg>
          <span class="hidden md:inline">SCRCPY</span>
        </button>
        <button class="btn btn-ghost w-16 h-16 md:w-full md:h-12 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 rounded-none"
          class:btn-active={activeMenu === 'dummy'}
          on:click={() => setMenu('dummy')}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          <span class="hidden md:inline">더미 메뉴</span>
        </button>
      </nav>
    </aside>
    <!-- 메인 컨텐츠 -->
    <main class="flex-1 p-6 overflow-y-auto">
      {#if activeMenu === 'scrcpy'}
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
      {:else if activeMenu === 'dummy'}
        <div class="max-w-2xl mx-auto">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">더미 메뉴</h2>
              <p>VS Code 스타일의 더미 메뉴입니다. 원하는 기능을 추가하세요.</p>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>
