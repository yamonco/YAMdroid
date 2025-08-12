export const SW_HIDE = 0;
export const SW_SHOW = 5;
export function hideScrcpyWindowByTitle(title: string) {
  const h = hwndByTitle(title);
  if (!h) return false;
  return ShowWindow(h, SW_HIDE);
}

export function showScrcpyWindowByTitle(title: string) {
  const h = hwndByTitle(title);
  if (!h) return false;
  return ShowWindow(h, SW_SHOW);
}
import koffi from 'koffi';

const user32 = koffi.load('user32.dll');
const FindWindowW = user32.func('FindWindowW', 'uint64', ['void*', 'str16']);
const ShowWindow = user32.func('ShowWindow', 'bool', ['uint64', 'int']);
const ShowWindowAsync = user32.func('ShowWindowAsync', 'bool', ['uint64', 'int']);
const SetForegroundWindow = user32.func('SetForegroundWindow', 'bool', ['uint64']);
const GetForegroundWindow = user32.func('GetForegroundWindow', 'uint64', []);
const SetWindowPos = user32.func('SetWindowPos', 'bool', ['uint64','long','int','int','int','int','uint']);
const AllowSetForegroundWindow = user32.func('AllowSetForegroundWindow', 'bool', ['int']);

export const HWND_NOTOPMOST = -2;
export const SW_RESTORE = 9, SW_FORCEMINIMIZE = 11;
export const SWP_NOSIZE=0x0001, SWP_NOMOVE=0x0002, SWP_NOACTIVATE=0x0010;

export function hwndByTitle(title:string){
  const h = FindWindowW(null, title);
  // 진단 로그
  console.log('[winapi] hwndByTitle:', title, '->', h);
  if (!h || h === 0n) return null;
  return h;
}

// 최소화 대신 완전 숨김으로 동작하도록 변경
export function minimizeScrcpyWindowByTitle(title:string){
  return hideScrcpyWindowByTitle(title);
}

export function focusScrcpyWindowByTitle(title:string){
  const h = hwndByTitle(title);
  if (!h) return false;
  // 완전 숨김 상태라면 먼저 ShowWindow(SW_SHOW)로 복원
  ShowWindow(h, SW_SHOW);
  AllowSetForegroundWindow(-1);
  ShowWindow(h, SW_RESTORE);
  if (SetForegroundWindow(h)) return true;
  const fg = GetForegroundWindow();
  if (!fg || fg === 0n) return false;
  // AttachThreadInput 등은 koffi로 직접 바인딩 필요시 추가 구현
  return SetForegroundWindow(h);
}
