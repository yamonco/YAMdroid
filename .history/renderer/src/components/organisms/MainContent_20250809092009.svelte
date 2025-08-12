<script>
  import MenuButton from '../atoms/MenuButton.svelte';
  import SideMenu from '../molecules/SideMenu.svelte';

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
  <div class="drawer drawer-mobile">
    <input id="side-menu" type="checkbox" class="drawer-toggle" bind:checked={menuOpen} />
    <div class="drawer-content flex flex-col">
      <MenuButton {toggleMenu} />
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
    <SideMenu {toggleMenu} />
  </div>
</div>
