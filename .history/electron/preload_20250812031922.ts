import { contextBridge, ipcRenderer } from "electron";

// SCRCPY 로그 수신용: 렌더러에서 window.bridge.onScrcpyLog(cb)로 등록

// scrcpyLog expose (중복 방지)
if (!window.hasOwnProperty('scrcpyLog')) {
  contextBridge.exposeInMainWorld("scrcpyLog", {
    on: (cb: (msg: string) => void) => {
      ipcRenderer.on("scrcpy-log", (_, msg) => cb(msg));
    }
  });
}


export const CONTEXT_BRIDGE = {
  /**
   * Returns the version from process.versions of the supplied target.
   */
  getVersion: async (opt: "electron" | "node"): Promise<string> => {
    return await ipcRenderer.invoke(`get-version`, opt);
  },
  /**
   * SCRCPY/ADB 프로세스 강제 종료
   */
  killScrcpyAdb: async (): Promise<any> => {
    return await ipcRenderer.invoke("kill-scrcpy-adb");
  },
  /**
   * scrcpy 폴더 내 scrcpy.exe가 존재하는 하위 폴더 리스트 반환
   */
  scanScrcpyFolders: async (): Promise<string[]> => {
    return await ipcRenderer.invoke("scan-scrcpy-folders");
  },
  /**
   * SCRCPY 실행 (params: { folder, device, resolution, dpi })
   */
  runScrcpy: async (params: { folder: string, device: string, resolution: string, dpi: string }) => {
    return await ipcRenderer.invoke("run-scrcpy", params);
  },

};

if (!window.hasOwnProperty('bridge')) {
  contextBridge.exposeInMainWorld("bridge", {
    ...CONTEXT_BRIDGE,
    saveProfiles: async (profiles: any) => {
      return await ipcRenderer.invoke('save-profiles', profiles);
    },
    loadProfiles: async () => {
      return await ipcRenderer.invoke('load-profiles');
    },
    exportProfiles: async (path: string) => {
      return await ipcRenderer.invoke('export-profiles', path);
    },
    importProfiles: async (path: string) => {
      return await ipcRenderer.invoke('import-profiles', path);
    },
    /** SCRCPY 세션 목록 조회 */
    listScrcpySessions: async () => {
      return await ipcRenderer.invoke('list-scrcpy-sessions');
    },
    /** SCRCPY 세션 포그라운드/백그라운드 전환 (창 제목 기반) */
    setScrcpyForeground: async (title: string, foreground: boolean) => {
      return await ipcRenderer.invoke('set-scrcpy-foreground', { title, foreground });
    },
    /** SCRCPY 세션 상태 변경 이벤트 구독 */
    onScrcpySessionUpdate: (cb: (msg: any) => void) => {
      ipcRenderer.on('scrcpy-session-update', (_, msg) => cb(msg));
    },
    /** SCRCPY 세션 개별 종료 (PID 기반) */
    killScrcpySession: async (pid: number) => {
      return await ipcRenderer.invoke('kill-scrcpy-session', pid);
    }
  });
}

// (중복 expose 제거)
