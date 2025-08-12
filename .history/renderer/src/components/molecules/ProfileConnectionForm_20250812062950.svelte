<script lang="ts">
  // 공통 연결/디바이스 폼 아톰화
  export let value = {
    // 연결/네트워크
    usb: false,
    tcpip: false,
    forceAdb: false,
    serial: '',
    addr: '',
    portRange: '',
    host: '',
    port: '',
    // 비디오/디스플레이
    maxSize: '',
    maxFps: '',
    videoCodec: '',
    videoBitrate: '',
    // 오디오
    audioSource: '',
    audioCodec: '',
    audioBitrate: '',
    requireAudio: false,
    // 입력
    keyboardMode: '',
    mouseMode: '',
    gamepadMode: '',
    noControl: false,
    // 창/표시/전원
    fullscreen: false,
    alwaysOnTop: false,
    windowBorderless: false,
    windowTitle: '',
    // 환경변수
    adbPath: '',
    androidSerial: '',
    iconPath: '',
    serverPath: '',
  };
  export let onChange: (field: string, value: any) => void = () => {};
  export let onSave: () => void = () => {};
</script>
<div class="space-y-6">
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">연결 방식</div>
    <div class="flex flex-wrap gap-6">
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.usb} on:change={e => onChange('usb', (e.target as HTMLInputElement).checked)} />
        USB 연결
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.tcpip} on:change={e => onChange('tcpip', (e.target as HTMLInputElement)?.checked)} />
        TCP/IP 연결
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.forceAdb} on:change={e => onChange('forceAdb', (e.target as HTMLInputElement)?.checked)} />
        adb forward 강제
      </label>
    </div>
  </div>
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">디바이스/네트워크</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">시리얼번호</span>
        <input value={value.serial} on:input={e => onChange('serial', (e.target as HTMLInputElement)?.value)} placeholder="시리얼번호" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">TCPIP 주소</span>
        <input value={value.addr} on:input={e => onChange('addr', (e.target as HTMLInputElement)?.value)} placeholder="ip:port" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
    </div>
  </div>
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">포트/터널</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">포트 범위</span>
        <input value={value.portRange} on:input={e => onChange('portRange', (e.target as HTMLInputElement)?.value)} placeholder="27183:27199" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">터널 호스트</span>
        <input value={value.host} on:input={e => onChange('host', (e.target as HTMLInputElement)?.value)} placeholder="localhost" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">터널 포트</span>
        <input value={value.port} on:input={e => onChange('port', (e.target as HTMLInputElement)?.value)} placeholder="0" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
    </div>
  </div>



  <!-- scrcpy 주요 옵션 확장: 비디오/오디오/입력/창/환경변수 등 -->
  <div class="mt-8 space-y-6 border-t pt-6">
    <div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">비디오/디스플레이</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">해상도 제한(긴 변)</span>
          <input type="number" min="0" value={value.maxSize} on:input={e => onChange('maxSize', (e.target as HTMLInputElement)?.value)} placeholder="1080" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">FPS 상한</span>
          <input type="number" min="0" value={value.maxFps} on:input={e => onChange('maxFps', (e.target as HTMLInputElement)?.value)} placeholder="60" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">비디오 코덱</span>
          <select value={value.videoCodec} on:change={e => onChange('videoCodec', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="h264">h264</option>
            <option value="h265">h265</option>
            <option value="av1">av1</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">비디오 비트레이트</span>
          <input value={value.videoBitrate} on:input={e => onChange('videoBitrate', (e.target as HTMLInputElement)?.value)} placeholder="8M" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
      </div>
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">오디오</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">오디오 소스</span>
          <select value={value.audioSource} on:change={e => onChange('audioSource', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="output">output</option>
            <option value="playback">playback</option>
            <option value="mic">mic</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">오디오 코덱</span>
          <select value={value.audioCodec} on:change={e => onChange('audioCodec', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="opus">opus</option>
            <option value="aac">aac</option>
            <option value="flac">flac</option>
            <option value="raw">raw</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">오디오 비트레이트</span>
          <input value={value.audioBitrate} on:input={e => onChange('audioBitrate', (e.target as HTMLInputElement)?.value)} placeholder="128K" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">오디오 필수</span>
          <input type="checkbox" checked={value.requireAudio} on:change={e => onChange('requireAudio', (e.target as HTMLInputElement)?.checked)} />
        </label>
      </div>
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">입력(HID/키보드/마우스)</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">키보드 모드</span>
          <select value={value.keyboardMode} on:change={e => onChange('keyboardMode', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="sdk">sdk</option>
            <option value="uhid">uhid</option>
            <option value="aoa">aoa</option>
            <option value="disabled">disabled</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">마우스 모드</span>
          <select value={value.mouseMode} on:change={e => onChange('mouseMode', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="sdk">sdk</option>
            <option value="uhid">uhid</option>
            <option value="aoa">aoa</option>
            <option value="disabled">disabled</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">게임패드 모드</span>
          <select value={value.gamepadMode} on:change={e => onChange('gamepadMode', (e.target as HTMLSelectElement)?.value)} class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm">
            <option value="">기본</option>
            <option value="uhid">uhid</option>
            <option value="aoa">aoa</option>
            <option value="disabled">disabled</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">읽기 전용(미러만)</span>
          <input type="checkbox" checked={value.noControl} on:change={e => onChange('noControl', (e.target as HTMLInputElement)?.checked)} />
        </label>
      </div>
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">창/표시/전원</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">전체화면</span>
          <input type="checkbox" checked={value.fullscreen} on:change={e => onChange('fullscreen', (e.target as HTMLInputElement)?.checked)} />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">항상 위</span>
          <input type="checkbox" checked={value.alwaysOnTop} on:change={e => onChange('alwaysOnTop', (e.target as HTMLInputElement)?.checked)} />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">창 데코 제거</span>
          <input type="checkbox" checked={value.windowBorderless} on:change={e => onChange('windowBorderless', (e.target as HTMLInputElement)?.checked)} />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">창 제목</span>
          <input value={value.windowTitle} on:input={e => onChange('windowTitle', (e.target as HTMLInputElement)?.value)} placeholder="Pixel 7" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
      </div>
    </div>
    <div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">환경변수</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">ADB 경로</span>
          <input value={value.adbPath} on:input={e => onChange('adbPath', (e.target as HTMLInputElement)?.value)} placeholder="adb.exe 경로" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">ANDROID_SERIAL</span>
          <input value={value.androidSerial} on:input={e => onChange('androidSerial', (e.target as HTMLInputElement)?.value)} placeholder="기본 시리얼" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">SCRCPY_ICON_PATH</span>
          <input value={value.iconPath} on:input={e => onChange('iconPath', (e.target as HTMLInputElement)?.value)} placeholder="아이콘 경로" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">SCRCPY_SERVER_PATH</span>
          <input value={value.serverPath} on:input={e => onChange('serverPath', (e.target as HTMLInputElement)?.value)} placeholder="서버 바이너리 경로" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 text-sm" />
        </label>
      </div>
    </div>
  </div>

    <div class="flex justify-end">
    <button on:click={onSave} class="h-10 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
      프로필 저장
    </button>
  </div>
</div>
