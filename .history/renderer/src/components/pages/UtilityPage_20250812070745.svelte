import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
let aaptStatus = writable('');

async function installAapt() {
  aaptStatus.set('aapt.exe 다운로드 중...');
  try {
    // aapt.exe 다운로드 URL (예: https://github.com/guugu/aapt-win32/releases/download/v1.0.0/aapt.exe)
    const url = 'https://github.com/guugu/aapt-win32/releases/download/v1.0.0/aapt.exe';
    // scrcpy 폴더 내에 저장
    const targetDir = await window.bridge.getScrcpyFolder?.() || '';
    if (!targetDir) throw new Error('scrcpy 폴더를 먼저 설정하세요.');
    const res = await fetch(url);
    if (!res.ok) throw new Error('aapt 다운로드 실패');
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    // Electron IPC로 파일 저장
    await window.bridge.saveAaptBinary?.(targetDir, new Uint8Array(arrayBuffer));
    aaptStatus.set('aapt.exe 설치 완료!');
  } catch (e) {
    aaptStatus.set('aapt 설치 실패: ' + e);
  }
}
<script lang="ts">
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

let installLog = writable('');
let installing = writable(false);

async function installTestApks() {
  installing.set(true);
  installLog.set('APK 설치를 시작합니다...\n');
  try {
    // 테스트바 폴더 내 APK 파일 목록 가져오기 (Node/Electron IPC 필요)
  const apkList: string[] = await window.bridge.listTaskbarApks?.() || [];
    if (apkList.length === 0) {
      installLog.set('테스트바 폴더에 APK가 없습니다.');
      installing.set(false);
      return;
    }
    for (const apk of apkList) {
      installLog.update(log => log + `\n[설치] ${apk}\n`);
  const result = await window.bridge.installApkWithAdb?.(apk);
      installLog.update(log => log + (result?.log || '[실패]') + '\n');
    }
    installLog.update(log => log + '\n설치 완료! 필요한 설정도 적용되었습니다.');
  } catch (e) {
    installLog.update(log => log + `\n[오류] ${e}`);
  }
  installing.set(false);
}
</script>

<div class="max-w-xl mx-auto py-8">
  <h2 class="text-2xl font-bold mb-4">유틸리티</h2>
  <div class="mb-6 flex flex-col gap-2">
    <button class="btn btn-primary" on:click={installTestApks} disabled={$installing}>
      테스트바 APK 일괄 설치 및 설정
    </button>
    <button class="btn btn-secondary" on:click={installAapt}>
      aapt.exe 자동 설치 (scrcpy 폴더)
    </button>
    <div class="text-xs text-zinc-400">{ $aaptStatus }</div>
  </div>
  <div class="bg-base-200 rounded p-4 text-xs whitespace-pre-wrap h-60 overflow-y-auto">
    {$installLog}
  </div>
</div>
