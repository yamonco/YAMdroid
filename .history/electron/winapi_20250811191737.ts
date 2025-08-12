import ffi from 'ffi-napi';
import ref from 'ref-napi';

const user32 = ffi.Library('user32', {
  FindWindowW:              ['pointer', ['pointer', 'pointer']],
  ShowWindow:               ['bool',    ['pointer', 'int']],
  ShowWindowAsync:          ['bool',    ['pointer', 'int']],
  SetForegroundWindow:      ['bool',    ['pointer']],
  GetForegroundWindow:      ['pointer', []],
  GetWindowThreadProcessId: ['uint32',  ['pointer', 'pointer']],
  AttachThreadInput:        ['bool',    ['uint32', 'uint32', 'bool']],
  SetWindowPos:             ['bool',    ['pointer','long','int','int','int','int','uint']],
  AllowSetForegroundWindow: ['bool',    ['int']]
});
export const HWND_NOTOPMOST = -2;
export const SW_RESTORE = 9, SW_FORCEMINIMIZE = 11;
export const SWP_NOSIZE=0x0001, SWP_NOMOVE=0x0002, SWP_NOACTIVATE=0x0010;
export const wstr = (s:string)=> Buffer.from(s + '\0','ucs2');

export function hwndByTitle(title:string){
  const h = user32.FindWindowW(ref.NULL, wstr(title));
  return ref.isNull(h) ? null : h;
}

export function minimizeScrcpyWindowByTitle(title:string){
  const h = hwndByTitle(title);
  if (!h) return false;
  user32.SetWindowPos(h, HWND_NOTOPMOST, 0,0,0,0, SWP_NOMOVE|SWP_NOSIZE|SWP_NOACTIVATE);
  return user32.ShowWindowAsync(h, SW_FORCEMINIMIZE);
}

export function focusScrcpyWindowByTitle(title:string){
  const h = hwndByTitle(title);
  if (!h) return false;
  user32.AllowSetForegroundWindow(-1);
  user32.ShowWindow(h, SW_RESTORE);
  if (user32.SetForegroundWindow(h)) return true;
  const fg = user32.GetForegroundWindow();
  if (ref.isNull(fg)) return false;
  const pidBuf1 = ref.alloc('uint32');
  const pidBuf2 = ref.alloc('uint32');
  const tFg = user32.GetWindowThreadProcessId(fg, pidBuf1);
  const tH  = user32.GetWindowThreadProcessId(h,  pidBuf2);
  if (tFg && tH) {
    user32.AttachThreadInput(tH, tFg, true);
    const ok = user32.SetForegroundWindow(h);
    user32.AttachThreadInput(tH, tFg, false);
    return ok;
  }
  return false;
}
