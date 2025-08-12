import koffi from 'koffi';
const user32 = koffi.load('user32.dll');
const FindWindowW = user32.func('FindWindowW', 'void*', ['void*', 'str16']);
const ShowWindowAsync = user32.func('ShowWindowAsync', 'bool', ['void*', 'int']);
const IsWindow = user32.func('IsWindow', 'bool', ['void*']);
const IsWindowVisible = user32.func('IsWindowVisible', 'bool', ['void*']);
const AllowSetForegroundWindow = user32.func('AllowSetForegroundWindow', 'bool', ['int']);
const SetForegroundWindow = user32.func('SetForegroundWindow', 'bool', ['void*']);
export const SW_HIDE = 0;
export const SW_SHOW = 5;
export const SW_RESTORE = 9;

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export async function hideScrcpyWindowByTitle(title: string) {
  const hwnd = FindWindowW(null, title);
  if (!hwnd || !IsWindow(hwnd)) {
    console.warn('[winapi] HWND not found (FindWindowW)', title);
    return false;
  }
  ShowWindowAsync(hwnd, SW_HIDE);
  await delay(80);
  const visible = IsWindowVisible(hwnd);
  console.info(`[winapi] ShowWindowAsync(SW_HIDE) -> visible=${visible}`);
  return !visible;
}

export async function showScrcpyWindowByTitle(title: string) {
  const hwnd = FindWindowW(null, title);
  if (!hwnd || !IsWindow(hwnd)) {
    console.warn('[winapi] HWND not found (FindWindowW)', title);
    return false;
  }
  ShowWindowAsync(hwnd, SW_SHOW);
  await delay(80);
  const visible = IsWindowVisible(hwnd);
  console.info(`[winapi] ShowWindowAsync(SW_SHOW) -> visible=${visible}`);
  return visible;
}

export function hwndByTitle(title: string) {
  const hwnd = FindWindowW(null, title);
  if (!hwnd || !IsWindow(hwnd)) return null;
  return hwnd;
}

export async function minimizeScrcpyWindowByTitle(title: string) {
  return await hideScrcpyWindowByTitle(title);
}

export async function focusScrcpyWindowByTitle(title: string) {
  const hwnd = FindWindowW(null, title);
  if (!hwnd || !IsWindow(hwnd)) {
    console.warn('[winapi] HWND not found (FindWindowW)', title);
    return false;
  }
  ShowWindowAsync(hwnd, SW_SHOW);
  await delay(80);
  AllowSetForegroundWindow(-1);
  ShowWindowAsync(hwnd, SW_RESTORE);
  await delay(80);
  const ok = SetForegroundWindow(hwnd);
  console.info(`[winapi] SetForegroundWindow -> ${ok}`);
  return ok;
}
