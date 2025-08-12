import { contextBridge, ipcRenderer } from "electron";

// SCRCPY 로그 수신용: 렌더러에서 window.bridge.onScrcpyLog(cb)로 등록

// window에 이미 scrcpyLog/bridge가 있으면 덮어쓰지 않음
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
    /**
     * 프로필 목록을 JSON 파일로 저장
     */
    saveProfiles: async (profiles) => {
      return await ipcRenderer.invoke('save-profiles', profiles);
    }
  });
}

// SCRCPY 로그 수신용: 렌더러에서 window.scrcpyLog.on(cb)로 등록
contextBridge.exposeInMainWorld("scrcpyLog", {
  on: (cb: (msg: string) => void) => {
    ipcRenderer.on("scrcpy-log", (_, msg) => cb(msg));
  }
});
