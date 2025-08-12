<script lang="ts">
import BaseButton from '../atoms/BaseButton.svelte';
import LabeledInput from '../molecules/LabeledInput.svelte';
  export let profiles = [];
  export let activeProfileIdx = 0;
  export let newProfileName = '';
  export let onAddProfile;
  export let onRemoveProfile;
  export let onSelectProfile;
  export let onUpdateProfileField;

  // 카테고리별 필드 목록 (for UI 반복)
  const categories = [
    {
      key: 'connection',
      label: '연결/디바이스',
      fields: [
        { key: 'selectUsb', label: 'USB 연결', type: 'checkbox', desc: '-d, --select-usb' },
        { key: 'selectTcpip', label: 'TCP/IP 연결', type: 'checkbox', desc: '-e, --select-tcpip' },
        { key: 'serial', label: '시리얼', placeholder: '시리얼번호', desc: '-s, --serial' },
        { key: 'tcpip', label: 'TCPIP 주소', placeholder: 'ip[:port]', desc: '--tcpip' },
        { key: 'port', label: '포트 범위', placeholder: '27183:27199', desc: '-p, --port' },
        { key: 'forceAdbForward', label: 'adb forward 강제', type: 'checkbox', desc: '--force-adb-forward' },
        { key: 'tunnelHost', label: '터널 호스트', placeholder: 'localhost', desc: '--tunnel-host' },
        { key: 'tunnelPort', label: '터널 포트', placeholder: '0', desc: '--tunnel-port' },
      ]
    },
    {
      key: 'video',
      label: '비디오 출력',
      fields: [
        { key: 'videoBitRate', label: '비트레이트', placeholder: '8M', desc: '-b, --video-bit-rate' },
        { key: 'maxSize', label: '최대 해상도(px)', placeholder: '0(무제한)', desc: '-m, --max-size' },
        { key: 'maxFps', label: '최대 FPS', placeholder: '', desc: '--max-fps' },
        { key: 'crop', label: '크롭(w:h:x:y)', placeholder: '', desc: '--crop' },
        { key: 'videoCodec', label: '비디오 코덱', placeholder: 'h264', desc: '--video-codec' },
        { key: 'videoEncoder', label: '인코더', placeholder: '', desc: '--video-encoder' },
        { key: 'videoCodecOptions', label: '코덱 옵션', placeholder: '', desc: '--video-codec-options' },
        { key: 'videoBuffer', label: '버퍼(ms)', placeholder: '0', desc: '--video-buffer' },
        { key: 'angle', label: '영상 회전', placeholder: '0', desc: '--angle' },
        { key: 'displayId', label: '디스플레이 ID', placeholder: '0', desc: '--display-id' },
        { key: 'displayOrientation', label: '초기 회전', placeholder: '0', desc: '--display-orientation' },
        { key: 'captureOrientation', label: '캡처 회전', placeholder: '0', desc: '--capture-orientation' },
        { key: 'orientation', label: '표시+녹화 회전', placeholder: '', desc: '--orientation' },
        { key: 'renderDriver', label: '렌더링 드라이버', placeholder: 'auto', desc: '--render-driver' },
      ]
    },
    // ... (audio, input, virtualDisplay, window, recording, utility 카테고리도 동일하게 추가)
  ];

  let activeTab = 0;
</script>




<section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
  <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정 (카테고리별)</div>
  <div class="flex gap-2 mb-3 border-b border-zinc-700 pb-1">
    {#each categories as cat, idx}
      <button
        class={`px-3 py-1 rounded-t border-b-2 text-xs font-semibold transition-colors ${activeTab === idx ? 'border-blue-400 text-blue-300 bg-zinc-900' : 'border-transparent text-zinc-400 bg-zinc-800 hover:bg-zinc-700'}`}
        type="button"
        on:click={() => activeTab = idx}
      >{cat.label}</button>
    {/each}
  </div>
  {#if categories[activeTab]}
    <div class="mb-2">
      <div class="font-semibold text-xs text-blue-200 mb-1">{categories[activeTab].label}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        {#each categories[activeTab].fields as field}
          {#if field.type === 'checkbox'}
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox"
                checked={profiles[activeProfileIdx][categories[activeTab].key]?.[field.key] || false}
                on:change={e => onUpdateProfileField(`${categories[activeTab].key}.${field.key}`, e.target.checked)}
              />
              {field.label} <span class="text-zinc-500">({field.desc})</span>
            </label>
          {:else}
            <LabeledInput
              label={field.label}
              placeholder={field.placeholder}
              value={profiles[activeProfileIdx][categories[activeTab].key]?.[field.key] ?? ''}
              onInput={e => onUpdateProfileField(`${categories[activeTab].key}.${field.key}`, e.target.value)}
              desc={field.desc}
            />
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</section>
