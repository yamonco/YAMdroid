// Svelte/Electron window.bridge, scrcpyLog 타입 확장
type ScrcpySession = {
  id: string;
  pid: number;
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
  foreground: boolean;
};
type Profile = {
  name: string;
  device: string;
  resolution: string;
  dpi: string;
};
type Bridge = {
  getVersion: (opt: 'electron' | 'node') => Promise<string>;
  killScrcpyAdb: () => Promise<any>;
  scanScrcpyFolders: () => Promise<string[]>;
  runScrcpy: (params: { folder: string; device: string; resolution: string; dpi: string }) => Promise<any>;
  setScrcpyForeground?: (title: string, fg: boolean) => Promise<void>;
  killScrcpySession?: (pid: number) => Promise<void>;
  listScrcpySessions?: () => Promise<ScrcpySession[]>;
  onScrcpySessionUpdate?: (cb: (msg: any) => void) => void;
  saveProfiles?: (profiles: Profile[]) => Promise<{ success: boolean; error?: string }>;
  // 추가된 기능들
  listTaskbarApks?: () => Promise<string[]>;
  installApkWithAdb?: (apkPath: string) => Promise<any>;
};
declare global {
  interface Window {
    bridge: Bridge;
    scrcpyLog?: { on: (cb: (msg: string) => void) => void };
  }
}
export {};
