// SCRCPY 경로 환경설정 저장/로드 (localStorage 기반)
export function getScrcpyRoot(): string {
  return localStorage.getItem('scrcpyRoot') || '';
}

export function setScrcpyRoot(path: string) {
  localStorage.setItem('scrcpyRoot', path);
}
