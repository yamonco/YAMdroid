<script lang="ts" context="module">
// Svelte 5 module script (optional, for exports)
</script>


<script lang="ts">
let overlayLog = '';
let overlayGranting = false;
let installLog = '';
let installing = false;

async function grantOverlayPermission() {
  overlayGranting = true;
  overlayLog = '앱위에 그리기 권한 부여를 시작합니다...\n';
  try {
    const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      overlayLog = '테스트바 폴더에 APK가 없습니다.';
      overlayGranting = false;
      return;
    }
    for (const apk of apkList) {
      overlayLog += `\n[권한 부여] ${apk}\n`;
      const result = await (window as any).bridge.grantOverlayPermission?.(apk);
      overlayLog += (result?.log || '[실패]') + '\n';
    }
    overlayLog += '\n앱위에 그리기 권한 부여 완료!';
  } catch (e) {
    overlayLog += `\n[오류] ${e}`;
  }
  overlayGranting = false;
}

async function installTestApks() {
  installing = true;
  installLog = 'APK 설치를 시작합니다...\n';
  try {
    const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      installLog = '테스트바 폴더에 APK가 없습니다.';
      installing = false;
      return;
    }
    for (const apk of apkList) {
      installLog += `\n[설치] ${apk}\n`;
      const result = await (window as any).bridge.installApkWithAdb?.(apk);
      installLog += (result?.log || '[실패]') + '\n';
    }
    installLog += '\n설치 완료! 필요한 설정도 적용되었습니다.';
  } catch (e) {
    installLog += `\n[오류] ${e}`;
  }
  installing = false;
}
</script>

<div class="mb-6 flex flex-col gap-2">
  <button class="btn btn-secondary" on:click={grantOverlayPermission} disabled={overlayGranting}>
    앱위에 그리기 권한 부여 (SYSTEM_ALERT_WINDOW)
  </button>
  <div class="text-xs text-zinc-400 whitespace-pre-line">{overlayLog}</div>
</div>
<div class="max-w-xl mx-auto py-8">
  <h2 class="text-2xl font-bold mb-4">유틸리티</h2>
  <div class="mb-6 flex flex-col gap-2">
    <button class="btn btn-primary" on:click={installTestApks} disabled={installing}>
      테스트바 APK 일괄 설치 및 설정
    </button>
  </div>
  <div class="bg-base-200 rounded p-4 text-xs whitespace-pre-wrap h-60 overflow-y-auto">
  {installLog}
  </div>
</div>
