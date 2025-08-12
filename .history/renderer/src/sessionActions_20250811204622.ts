// SCRCPY 세션별 개별 액션 함수 모듈
export async function setSessionForeground(session, foreground) {
  const title = `SCRCPY_${session.device}`;
  return await window.bridge.setScrcpyForeground(title, foreground);
}

export async function killSession(session) {
  // 세션별 종료 로직 (예: PID로 종료)
  return await window.bridge.killScrcpySession(session.pid);
}
