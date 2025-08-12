import koffi from 'koffi';

const user32 = koffi.load('user32.dll');
const FindWindowW = user32.func('FindWindowW', 'void*', ['void*', 'str16']);
const ShowWindow = user32.func('ShowWindow', 'bool', ['void*', 'int']);
const ShowWindowAsync = user32.func('ShowWindowAsync', 'bool', ['void*', 'int']);
const SetForegroundWindow = user32.func('SetForegroundWindow', 'bool', ['void*']);
const GetForegroundWindow = user32.func('GetForegroundWindow', 'void*', []);
const SetWindowPos = user32.func('SetWindowPos', 'bool', ['void*','long','int','int','int','int','uint']);
const AllowSetForegroundWindow = user32.func('AllowSetForegroundWindow', 'bool', ['int']);

export const HWND_NOTOPMOST = -2;
export const SW_RESTORE = 9, SW_FORCEMINIMIZE = 11;
export const SWP_NOSIZE=0x0001, SWP_NOMOVE=0x0002, SWP_NOACTIVATE=0x0010;

export function hwndByTitle(title:string){
  const h = FindWindowW(null, title);
  // koffi는 pointer 반환 시 BigInt(주소) 또는 null 반환
  if (!h || h === 0n) return null;
  return h;
}

export function minimizeScrcpyWindowByTitle(title:string){
  const h = hwndByTitle(title);
  if (!h) return false;
  SetWindowPos(h, HWND_NOTOPMOST, 0,0,0,0, SWP_NOMOVE|SWP_NOSIZE|SWP_NOACTIVATE);
  return ShowWindowAsync(h, SW_FORCEMINIMIZE);
}

export function focusScrcpyWindowByTitle(title:string){
  const h = hwndByTitle(title);
  if (!h) return false;
  AllowSetForegroundWindow(-1);
  ShowWindow(h, SW_RESTORE);
  if (SetForegroundWindow(h)) return true;
  const fg = GetForegroundWindow();
  if (!fg || fg === 0n) return false;
  // AttachThreadInput 등은 koffi로 직접 바인딩 필요시 추가 구현
  return SetForegroundWindow(h);
}
