
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { minimizeScrcpyWindowByTitle, focusScrcpyWindowByTitle } from './winapi';
import { spawn, exec } from 'child_process';
import electronReload from 'electron-reload';
const { v4: uuidv4 } = require('uuid');

// 파일 저장 다이얼로그 IPC 핸들러
ipcMain.handle('show-save-dialog', async (_event, options) => {
  return await dialog.showSaveDialog(options);
});

const PROFILE_PATH = join(process.cwd(), 'resources', 'profiles', 'profiles.json');
ipcMain.handle('load-profiles', async () => {
  try {
    const raw = readFileSync(PROFILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
});
ipcMain.handle('save-profiles', async (_event, profiles) => {
  writeFileSync(PROFILE_PATH, JSON.stringify(profiles, null, 2), 'utf-8');
  return true;
});
ipcMain.handle('export-profiles', async (_event, path) => {
  const raw = readFileSync(PROFILE_PATH, 'utf-8');
  writeFileSync(path, raw, 'utf-8');
  return true;
});
ipcMain.handle('import-profiles', async (_event, path) => {
  const raw = readFileSync(path, 'utf-8');
  writeFileSync(PROFILE_PATH, raw, 'utf-8');
  return true;
});

// 개별 SCRCPY 세션 종료 (PID 기반)
ipcMain.handle("kill-scrcpy-session", async (event, pid: number) => {
  if (!pid) return { success: false, error: 'No PID' };
  try {
    // Windows: taskkill /PID <pid> /F
    await new Promise((resolve, reject) => {
      exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
        if (err) return reject(stderr || err);
        resolve(stdout);
      });
    });
    // 세션 목록에서 제거
    for (const id in scrcpySessions) {
      if (scrcpySessions[id].pid === pid) delete scrcpySessions[id];
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

// 싱글 인스턴스 락 (핫리로드/중복 실행 방지)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

// SCRCPY 세션 관리용
type ScrcpySession = {
  id: string;
  pid: number;
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
  process: ReturnType<typeof spawn>;
  foreground: boolean;
};
const scrcpySessions: Record<string, ScrcpySession> = {};

// IPC 핸들러 글로벌 등록 + 중복 등록 가드
let handlersRegistered = false;
function registerIpcHandlers() {
  if (handlersRegistered) return;
  handlersRegistered = true;

  ipcMain.handle("list-scrcpy-sessions", () => {
    return Object.values(scrcpySessions).map(s => ({
      id: s.id,
      pid: s.pid,
      folder: s.folder,
      device: s.device,
      resolution: s.resolution,
      dpi: s.dpi,
      foreground: s.foreground
    }));
  });

  ipcMain.handle("set-scrcpy-foreground", async (event, payload: { title: string, foreground: boolean }) => {
    console.log('[IPC] set-scrcpy-foreground called:', payload);
    const { title, foreground } = payload;
    if (process.platform !== 'win32') return { success: false, error: 'Windows only' };
    let ok = false;
    if (foreground) ok = await focusScrcpyWindowByTitle(title);
    else ok = await minimizeScrcpyWindowByTitle(title);

    // device 추출 (title: SCRCPY_${device})
    const device = title.replace(/^SCRCPY_/, '');
    let sessionId: string | null = null;
    for (const id in scrcpySessions) {
      if (scrcpySessions[id].device === device) {
        scrcpySessions[id].foreground = foreground;
        sessionId = scrcpySessions[id].id;
      }
    }
    // 상태 동기화: 프론트에 push
    event.sender.send('scrcpy-session-update', { type: 'foreground', sessionId, foreground });

    if (!ok) {
      console.warn('[IPC] set-scrcpy-foreground: HWND not found for', title);
    }
    console.log('[IPC] set-scrcpy-foreground result:', ok);
    return { success: ok };
  });
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  // 개발환경에서 main process 핫리로드 활성화 (초기화 이후에만!)
  if (!app.isPackaged) {
    electronReload(join(__dirname), {
      forceHardReset: true,
      hardResetMethod: "quit",
      electron: app.getPath("exe"),
    });
  }
  console.log("[Electron] main() called");
  let mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    resizable: true, // 창 크기 조절 가능
    show: false,
    webPreferences: {
      devTools: true,
      preload: join(__dirname, "preload.js"),
    },
  });
  console.log("[Electron] mainWindow created");

  // DevTools 중복 실행 방지: ready-to-show에서만 1회 오픈
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  if (app.isPackaged) {
    console.log("[Electron] app is packaged, loading index.html");
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    console.log('[Electron] loadFile called:', join(__dirname, "../renderer/index.html"));
  } else {
    console.log("[Electron] app is in dev mode, setting up electron-reload");
    await mainWindow.loadURL(`http://localhost:5173/`);
    console.log('[Electron] loadURL called: http://localhost:5173/');
  }
  // ...existing code...
  console.log("[Electron] main() end");
});

// SCRCPY/ADB 하드킬 IPC
ipcMain.handle("kill-scrcpy-adb", async (event) => {
  try {
    const killCmds = [
      'taskkill /IM scrcpy.exe /F',
      'taskkill /IM adb.exe /F'
    ];
    let results = [];
    for (const cmd of killCmds) {
      await new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => {
          results.push(`[${cmd}]\n${stdout}${stderr}${err ? '\n[실패] ' + err.message : ''}`);
          resolve(null);
        });
      });
    }
    event.sender.send("scrcpy-log", results.join("\n"));
    return { success: true, log: results.join("\n") };
  } catch (e) {
    event.sender.send("scrcpy-log", `[SCRCPY/ADB 종료 실패] ${e && e.stack ? e.stack : e}`);
    return { success: false, error: String(e) };
  }
});

// SCRCPY 실행 IPC
ipcMain.handle("run-scrcpy", async (event, params: { folder: string, args: string[] }) => {
  try {
    const baseDir = app.isPackaged
      ? join(app.getAppPath(), "../resources/scrcpy")
      : join(process.cwd(), "resources/scrcpy");
    const exePath = join(baseDir, params.folder, "scrcpy.exe");
    const cwd = join(baseDir, params.folder);
    // 실행 경로/옵션 로그 전달
    event.sender.send("scrcpy-log", `[실행경로] ${exePath}\n[작업폴더] ${cwd}\n[옵션] ${(params.args||[]).join(' ')}`);
    if (!existsSync(exePath)) {
      throw new Error("scrcpy.exe not found");
    }
    const child = spawn(exePath, params.args || [], { cwd });
    const sessionId = uuidv4();
    const session: ScrcpySession = {
      id: sessionId,
      pid: child.pid ?? 0,
      folder: params.folder,
      device: '',
      resolution: '',
      dpi: '',
      process: child,
      foreground: true,
    };
    scrcpySessions[sessionId] = session;
    // 실행 알림
    event.sender.send("scrcpy-session-update", { type: 'start', session: { ...session, process: undefined } });
    child.stdout.on("data", (data) => {
      event.sender.send("scrcpy-log", data.toString());
    });
    child.stderr.on("data", (data) => {
      event.sender.send("scrcpy-log", data.toString());
    });
    child.on("error", (err) => {
      event.sender.send("scrcpy-log", "[실행 오류] " + err.message);
    });
    child.on("close", (code) => {
      event.sender.send("scrcpy-log", `[종료] 코드: ${code}`);
      // 종료 알림 및 세션 제거
      event.sender.send("scrcpy-session-update", { type: 'end', sessionId });
      delete scrcpySessions[sessionId];
    });
    return { success: true, sessionId };
  } catch (e) {
    event.sender.send("scrcpy-log", `[실패] ${e && e.stack ? e.stack : e}`);
    return { success: false, error: String(e) };
  }
});

let mainWindow: BrowserWindow;

app.once("ready", main);

async function main() {
  console.log("[Electron] main() called");
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    resizable: true, // 창 크기 조절 가능
    show: false,
    webPreferences: {
      devTools: true,
      preload: join(__dirname, "preload.js"),
    },
  });
  console.log("[Electron] mainWindow created");

  // 개발자 도구(F12) 강제 오픈
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  if (app.isPackaged) {
    console.log("[Electron] app is packaged, loading index.html");
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    console.log('[Electron] loadFile called:', join(__dirname, "../renderer/index.html"));
  } else {
    console.log("[Electron] app is in dev mode, setting up electron-reload");
    electronReload(join(__dirname), {
      forceHardReset: true,
      hardResetMethod: "quit",
      electron: app.getPath("exe"),
    });
    console.log("[Electron] loading http://localhost:5173/");
    await mainWindow.loadURL(`http://localhost:5173/`);
    console.log('[Electron] loadURL called: http://localhost:5173/');
  }

  // 로드 성공/실패 로그
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] did-finish-load');
  });

  // ready-to-show가 3초 내 발생하지 않으면 강제 show
  let readyToShow = false;
  mainWindow.once("ready-to-show", () => {
    readyToShow = true;
    console.log("[Electron] mainWindow ready-to-show");
    try {
      mainWindow.show();
      mainWindow.setAlwaysOnTop(true);
      mainWindow.focus();
      mainWindow.restore();
      mainWindow.center();
      setTimeout(() => {
        const bounds = mainWindow.getBounds();
        console.log('[Electron] mainWindow bounds:', bounds);
        console.log('[Electron] isVisible:', mainWindow.isVisible());
        console.log('[Electron] isMinimized:', mainWindow.isMinimized());
        console.log('[Electron] isFocused:', mainWindow.isFocused());
        console.log('[Electron] isDestroyed:', mainWindow.isDestroyed());
      }, 500);
    } catch (e) {
      console.error("[Electron] mainWindow.show() error:", e);
    }
  });
  setTimeout(() => {
    if (!readyToShow) {
      console.warn('[Electron] ready-to-show가 3초 내 발생하지 않음. 강제 show() 시도');
      try {
        mainWindow.show();
        mainWindow.setAlwaysOnTop(true);
        mainWindow.focus();
        mainWindow.restore();
        mainWindow.center();
        const bounds = mainWindow.getBounds();
        console.log('[Electron] mainWindow bounds:', bounds);
        console.log('[Electron] isVisible:', mainWindow.isVisible());
        console.log('[Electron] isMinimized:', mainWindow.isMinimized());
        console.log('[Electron] isFocused:', mainWindow.isFocused());
        console.log('[Electron] isDestroyed:', mainWindow.isDestroyed());
      } catch (e) {
        console.error('[Electron] 강제 show() error:', e);
      }
    }
  }, 3000);

  mainWindow.once("ready-to-show", () => {
    console.log("[Electron] mainWindow ready-to-show");
    try {
      mainWindow.show();
      // 창이 반드시 뜨도록 강제
      mainWindow.setAlwaysOnTop(true);
      mainWindow.focus();
      mainWindow.restore();
      mainWindow.center();
      // 창 상태 상세 로그
      setTimeout(() => {
        const bounds = mainWindow.getBounds();
        console.log('[Electron] mainWindow bounds:', bounds);
        console.log('[Electron] isVisible:', mainWindow.isVisible());
        console.log('[Electron] isMinimized:', mainWindow.isMinimized());
        console.log('[Electron] isFocused:', mainWindow.isFocused());
        console.log('[Electron] isDestroyed:', mainWindow.isDestroyed());
      }, 500);
    } catch (e) {
      console.error("[Electron] mainWindow.show() error:", e);
    }
  });

  // 상세 에러 핸들러 등록
  mainWindow.on('unresponsive', () => {
    console.error('[Electron] mainWindow unresponsive');
    mainWindow.webContents.executeJavaScript('alert("[Electron] 창이 응답하지 않습니다.")');
  });
  // mainWindow 'crashed' 이벤트는 없음. renderer-process-crashed로 대체
  app.on('renderer-process-crashed', (event, webContents, killed) => {
    console.error('[Electron] renderer-process-crashed', killed);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript('alert("[Electron] 렌더러 프로세스가 크래시되었습니다.")');
    }
  });
  mainWindow.on('closed', () => {
    console.error('[Electron] mainWindow closed');
  });
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`[Electron] did-fail-load: ${errorCode} ${errorDescription}`);
    mainWindow.webContents.executeJavaScript(`alert('[Electron] 로드 실패: ${errorDescription}')`);
  });

  console.log("[Electron] main() end");
}

ipcMain.handle("get-version", (_, key: "electron" | "node") => {
  return String(process.versions[key]);
});

// scrcpy 폴더 내 하위 폴더 중 scrcpy.exe가 존재하는 폴더 리스트 반환
ipcMain.handle("scan-scrcpy-folders", async () => {
  try {
    const baseDir = app.isPackaged
      ? join(app.getAppPath(), "../resources/scrcpy")
      : join(process.cwd(), "resources/scrcpy");
    const folders = readdirSync(baseDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    const result = folders.filter((folder) => {
      const exePath = join(baseDir, folder, "scrcpy.exe");
      return existsSync(exePath);
    });
    return result;
  } catch (e) {
    return [];
  }
});
