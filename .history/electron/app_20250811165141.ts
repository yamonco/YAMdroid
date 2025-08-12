// SCRCPY/ADB 하드킬 IPC
import { exec } from "child_process";
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

import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "child_process";
import electronReload from "electron-reload";
import { join } from "path";
import { readdirSync, statSync, existsSync } from "fs";

// SCRCPY 실행 IPC
ipcMain.handle("run-scrcpy", async (event, params: { folder: string, device: string, resolution: string, dpi: string }) => {
  try {
    const baseDir = app.isPackaged
      ? join(app.getAppPath(), "../resources/scrcpy")
      : join(process.cwd(), "resources/scrcpy");
    const exePath = join(baseDir, params.folder, "scrcpy.exe");
    const cwd = join(baseDir, params.folder);
    const args = [];
    if (params.resolution) args.push("--max-size", params.resolution);
    if (params.dpi) args.push("--dpi", params.dpi);
    // 실행 경로/옵션 로그 전달
    event.sender.send("scrcpy-log", `[실행경로] ${exePath}\n[작업폴더] ${cwd}\n[옵션] ${args.join(' ')}`);
    if (!existsSync(exePath)) {
      throw new Error("scrcpy.exe not found");
    }
    // 필요시 device 옵션 등 추가 가능
    const child = spawn(exePath, args, { cwd });
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
    });
    return { success: true };
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
      devTools: true || !app.isPackaged,
      preload: join(__dirname, "preload.js"),
    },
  });
  console.log("[Electron] mainWindow created");

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
