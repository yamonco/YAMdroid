// 프로필 관련 액션 (pure function)
export function addProfile(profiles: any[], newProfileName: string) {
  if (!newProfileName.trim()) return profiles;
  return [
    ...profiles,
    {
      name: newProfileName,
      connection: {},
      video: {},
      // ...audio, input, virtualDisplay, window, recording, utility 등 초기값
    }
  ];
}

export function removeProfile(profiles: any[], idx: number) {
  if (profiles.length === 1) return profiles;
  return profiles.filter((_, i) => i !== idx);
}

export function selectProfile(idx: number) {
  return idx;
}

export function updateProfileField(profiles: any[], activeProfileIdx: number, field: string, value: string) {
  if (field === 'newProfileName') return { profiles, newProfileName: value };
  const arr = [...profiles];
  arr[activeProfileIdx] = { ...arr[activeProfileIdx], [field]: value };
  return { profiles: arr };
}

export function saveSelection() {
  // 실제 저장 로직 필요시 구현
  return true;
}
// SCRCPY 액션: 서비스 조합, 도메인 로직, pure function
import { scrcpyService } from './scrcpy.service';
import type { ScrcpySession } from './scrcpy.types';

export const refreshSessions = async () =>
  (await scrcpyService.list()).sort((a, b) => +b.foreground - +a.foreground);

export const setSessionForeground = async (session: ScrcpySession, fg: boolean) => {
  const title = `SCRCPY_${session.device}`;
  return scrcpyService.setForeground(title, fg);
};

export const killSession = async (session: ScrcpySession) => {
  return scrcpyService.kill(session.pid);
};

// SCRCPY 폴더 목록 로드 액션
export const loadFolders = async (): Promise<string[]> => {
  return await scrcpyService.scanFolders();
};
