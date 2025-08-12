import { onMount } from 'svelte';
import { writable, get } from 'svelte/store';

let overlayLog = writable('');
let overlayGranting = writable(false);

<script lang="ts">
import { onMount } from 'svelte';
import { writable, get } from 'svelte/store';

let overlayLog = writable('');
let overlayGranting = writable(false);
let installLog = writable('');
let installing = writable(false);

async function grantOverlayPermission() {
  overlayGranting.set(true);
  overlayLog.set('앱위에 그리기 권한 부여를 시작합니다...\n');
  try {
    const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      overlayLog.set('테스트바 폴더에 APK가 없습니다.');
      overlayGranting.set(false);
      return;
    }
    for (const apk of apkList) {
      overlayLog.update(log => log + `\n[권한 부여] ${apk}\n`);
      const result = await (window as any).bridge.grantOverlayPermission?.(apk);
      overlayLog.update(log => log + (result?.log || '[실패]') + '\n');
    }
    overlayLog.update(log => log + '\n앱위에 그리기 권한 부여 완료!');
  } catch (e) {
    overlayLog.update(log => log + `\n[오류] ${e}`);
  }
  overlayGranting.set(false);
}

async function installTestApks() {
  installing.set(true);
  installLog.set('APK 설치를 시작합니다...\n');
  try {
    const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      installLog.set('테스트바 폴더에 APK가 없습니다.');
      installing.set(false);
      return;
    }
    for (const apk of apkList) {
      installLog.update(log => log + `\n[설치] ${apk}\n`);
      const result = await (window as any).bridge.installApkWithAdb?.(apk);
      installLog.update(log => log + (result?.log || '[실패]') + '\n');
    }
    installLog.update(log => log + '\n설치 완료! 필요한 설정도 적용되었습니다.');
  } catch (e) {
    installLog.update(log => log + `\n[오류] ${e}`);
  }
  installing.set(false);
}
</script>
        if (apkList.length === 0) {
          overlayLog.set('테스트바 폴더에 APK가 없습니다.');
          overlayGranting.set(false);
          return;
        }
        for (const apk of apkList) {
          overlayLog.update(log => log + `\n[권한 부여] ${apk}\n`);
          const result = await (window as any).bridge.grantOverlayPermission?.(apk);
          overlayLog.update(log => log + (result?.log || '[실패]') + '\n');
        }
        overlayLog.update(log => log + '\n앱위에 그리기 권한 부여 완료!');
      } catch (e) {
        overlayLog.update(log => log + `\n[오류] ${e}`);
      }
      overlayGranting.set(false);
    }

    let installLog = writable('');
    let installing = writable(false);

    async function installTestApks() {
      installing.set(true);
      installLog.set('APK 설치를 시작합니다...\n');
      try {
        // 테스트바 폴더 내 APK 파일 목록 가져오기 (Node/Electron IPC 필요)
        const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
        if (apkList.length === 0) {
          installLog.set('테스트바 폴더에 APK가 없습니다.');
          installing.set(false);
          return;
        }
        for (const apk of apkList) {
          installLog.update(log => log + `\n[설치] ${apk}\n`);
          const result = await (window as any).bridge.installApkWithAdb?.(apk);
          installLog.update(log => log + (result?.log || '[실패]') + '\n');
        }
        installLog.update(log => log + '\n설치 완료! 필요한 설정도 적용되었습니다.');
      } catch (e) {
        installLog.update(log => log + `\n[오류] ${e}`);
      }
      installing.set(false);
    }
    </script>
      <div class="mb-6 flex flex-col gap-2">
        <button class="btn btn-secondary" on:click={grantOverlayPermission} disabled={$overlayGranting}>
          앱위에 그리기 권한 부여 (SYSTEM_ALERT_WINDOW)
        </button>
        <div class="text-xs text-zinc-400 whitespace-pre-line">{ $overlayLog }</div>
      </div>
    for (const apk of apkList) {
      overlayLog.update(log => log + `\n[권한 부여] ${apk}\n`);
      const result = await (window as any).bridge.grantOverlayPermission?.(apk);
      overlayLog.update(log => log + (result?.log || '[실패]') + '\n');
    }
    overlayLog.update(log => log + '\n앱위에 그리기 권한 부여 완료!');
  } catch (e) {
    overlayLog.update(log => log + `\n[오류] ${e}`);
  }
  overlayGranting.set(false);
}

let installLog = writable('');
let installing = writable(false);

async function installTestApks() {
  installing.set(true);
  installLog.set('APK 설치를 시작합니다...\n');
  try {
    // 테스트바 폴더 내 APK 파일 목록 가져오기 (Node/Electron IPC 필요)
    const apkList: string[] = await (window as any).bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      installLog.set('테스트바 폴더에 APK가 없습니다.');
      installing.set(false);
      return;
    }
    for (const apk of apkList) {
      installLog.update(log => log + `\n[설치] ${apk}\n`);
      const result = await (window as any).bridge.installApkWithAdb?.(apk);
      installLog.update(log => log + (result?.log || '[실패]') + '\n');
    }
    installLog.update(log => log + '\n설치 완료! 필요한 설정도 적용되었습니다.');
  } catch (e) {
    installLog.update(log => log + `\n[오류] ${e}`);
  }
  installing.set(false);
}
</script>
  <div class="mb-6 flex flex-col gap-2">
    <button class="btn btn-secondary" on:click={grantOverlayPermission} disabled={$overlayGranting}>
      앱위에 그리기 권한 부여 (SYSTEM_ALERT_WINDOW)
    </button>
    <div class="text-xs text-zinc-400 whitespace-pre-line">{ $overlayLog }</div>
  </div>
<div class="max-w-xl mx-auto py-8">
  <h2 class="text-2xl font-bold mb-4">유틸리티</h2>
  <div class="mb-6 flex flex-col gap-2">
    <button class="btn btn-primary" on:click={installTestApks} disabled={$installing}>
      테스트바 APK 일괄 설치 및 설정
    </button>
  </div>
  <div class="bg-base-200 rounded p-4 text-xs whitespace-pre-wrap h-60 overflow-y-auto">
    {$installLog}
  </div>
</div>
