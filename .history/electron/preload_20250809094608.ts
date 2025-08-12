import { contextBridge, ipcRenderer } from "electron";


export const CONTEXT_BRIDGE = {
  /**
   * Returns the version from process.versions of the supplied target.
   */
  getVersion: async (opt: "electron" | "node"): Promise<string> => {
    return await ipcRenderer.invoke(`get-version`, opt);
  },
  /**
   * scrcpy 폴더 내 scrcpy.exe가 존재하는 하위 폴더 리스트 반환
   */
  scanScrcpyFolders: async (): Promise<string[]> => {
    return await ipcRenderer.invoke("scan-scrcpy-folders");
  },
};

contextBridge.exposeInMainWorld("bridge", CONTEXT_BRIDGE);
