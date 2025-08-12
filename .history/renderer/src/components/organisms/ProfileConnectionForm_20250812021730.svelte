<script lang="ts">
  // 공통 연결/디바이스 폼 아톰화
  export let value = {
    usb: false,
    tcpip: false,
    forceAdb: false,
    serial: '',
    addr: '',
    portRange: '',
    host: '',
    port: '',
  };
  export let onChange: (field: string, value: any) => void = () => {};
  export let onSave: () => void = () => {};
</script>
<div class="space-y-6">
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">연결 방식</div>
    <div class="flex flex-wrap gap-6">
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.usb} on:change={e => onChange('usb', e.target.checked)} />
        USB 연결
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.tcpip} on:change={e => onChange('tcpip', e.target.checked)} />
        TCP/IP 연결
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" class="h-4 w-4 accent-blue-600" checked={value.forceAdb} on:change={e => onChange('forceAdb', e.target.checked)} />
        adb forward 강제
      </label>
    </div>
  </div>
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">디바이스/네트워크</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">시리얼번호</span>
        <input value={value.serial} on:input={e => onChange('serial', e.target.value)} placeholder="시리얼번호" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">TCPIP 주소</span>
        <input value={value.addr} on:input={e => onChange('addr', e.target.value)} placeholder="ip:port" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
    </div>
  </div>
  <div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">포트/터널</div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">포트 범위</span>
        <input value={value.portRange} on:input={e => onChange('portRange', e.target.value)} placeholder="27183:27199" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">터널 호스트</span>
        <input value={value.host} on:input={e => onChange('host', e.target.value)} placeholder="localhost" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">터널 포트</span>
        <input value={value.port} on:input={e => onChange('port', e.target.value)} placeholder="0" class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
    </div>
  </div>
  <div class="flex justify-end">
    <button on:click={onSave} class="h-10 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
      프로필 저장
    </button>
  </div>
</div>
