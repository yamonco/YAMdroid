<script>
  let scrcpyFolders = [];
  let scanned = false;
  let activeSection = 'chat';
  let activeTab = 'scrcpy';

  async function scanScrcpy() {
    scanned = false;
    scrcpyFolders = [];
    if (window.bridge?.scanScrcpyFolders) {
      scrcpyFolders = await window.bridge.scanScrcpyFolders();
    }
    scanned = true;
  }

  function setSection(section) {
    activeSection = section;
  }
  function setTab(tab) {
    activeTab = tab;
  }
</script>

<div class="min-h-screen flex flex-col bg-base-200">
  <!-- 상단 헤더 -->
  <div class="navbar bg-neutral text-neutral-content shadow-md z-10 px-4">
    <div class="flex-1">
      <span class="font-bold text-lg tracking-wide">YAMdroid Studio</span>
      <div class="ml-4 flex gap-2">
        <button class="btn btn-ghost btn-sm btn-square" title="폴더 열기">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" /></svg>
        </button>
        <button class="btn btn-ghost btn-sm btn-square" title="검색">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
        </button>
      </div>
    </div>
    <div class="flex-none gap-2">
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
    <!-- 좌측 넓은 섹션 사이드바 -->
    <aside class="w-64 bg-base-300 border-r border-base-content/10 flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <ul class="menu menu-lg p-2 gap-2">
          <li>
            <a class:active={activeSection==='chat'} on:click={() => setSection('chat')}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2m4-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
              채팅 목록
            </a>
          </li>
          <li>
            <a class:active={activeSection==='explorer'} on:click={() => setSection('explorer')}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" /></svg>
              파일 탐색기
            </a>
          </li>
          <li>
            <a class:active={activeSection==='search'} on:click={() => setSection('search')}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
              검색
            </a>
          </li>
          <li>
            <a class:active={activeSection==='settings'} on:click={() => setSection('settings')}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" /></svg>
              설정
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <!-- 메인 컨텐츠 -->
    <main class="flex-1 p-6 overflow-y-auto bg-base-100">
      <!-- 탭 -->
      <div class="tabs tabs-boxed mb-4">
        <a class="tab" class:tab-active={activeTab==='scrcpy'} on:click={() => setTab('scrcpy')}>SCRCPY</a>
        <a class="tab" class:tab-active={activeTab==='dummy'} on:click={() => setTab('dummy')}>더미 탭</a>
      </div>
      <!-- 탭별 컨텐츠 -->
      {#if activeTab === 'scrcpy'}
        <div class="max-w-2xl mx-auto">
          <div class="card bg-base-200 shadow-xl">
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
      {:else if activeTab === 'dummy'}
        <div class="max-w-2xl mx-auto">
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">더미 탭</h2>
              <p>여기에 원하는 기능을 추가하세요.</p>
            </div>
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>
