// SCRCPY 서비스: window.bridge 직접 호출만 담당
import type { ScrcpySession } from './scrcpy.types';

export const scrcpyService = {
  list: async (): Promise<ScrcpySession[]> => window.bridge.listScrcpySessions(),
  setForeground: async (title: string, fg: boolean) => window.bridge.setScrcpyForeground(title, fg),
  kill: async (pid: number) => window.bridge.killScrcpySession(pid),
  scanFolders: async (): Promise<string[]> => window.bridge.scanScrcpyFolders(),
} as const;
