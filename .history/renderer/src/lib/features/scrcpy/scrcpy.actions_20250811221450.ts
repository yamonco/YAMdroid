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
