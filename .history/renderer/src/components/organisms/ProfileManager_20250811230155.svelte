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
</script>

<section class="w-full flex flex-col gap-2 mb-4">
  <div class="flex items-center gap-2 mb-1">
    <span class="font-semibold text-sm">프로필 목록</span>
    <LabeledInput
      label=""
      placeholder="새 프로필명"
      value={newProfileName}
      onInput={(e) => { newProfileName = e.target.value; }}
    />
    <BaseButton className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold" on:click={onAddProfile}>추가</BaseButton>
  </div>
  <div class="flex flex-wrap gap-2">
    {#each profiles as profile, idx}
      <div class="flex items-center gap-1">
        <BaseButton
          className={`px-3 py-1 rounded border ${idx === activeProfileIdx ? 'border-blue-500 bg-blue-500/20 text-blue-200' : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
          on:click={() => onSelectProfile(idx)}
        >{profile.name}</BaseButton>
        {#if profiles.length > 1}
          <BaseButton type="button" className="text-xs text-red-400 cursor-pointer bg-transparent border-0" on:click={() => onRemoveProfile(idx)} aria-label="프로필 삭제">✕</BaseButton>
        {/if}
      </div>
    {/each}
  </div>
</section>

<section class="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-800 flex flex-col gap-2 mb-2">
  <div class="font-semibold text-blue-300 text-xs mb-1">프로필 설정 (카테고리별)</div>
  {#each categories as cat}
    <div class="mb-2">
      <div class="font-semibold text-xs text-blue-200 mb-1">{cat.label}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        {#each cat.fields as field}
          {#if field.type === 'checkbox'}
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox"
                checked={profiles[activeProfileIdx][cat.key]?.[field.key] || false}
                on:change={e => onUpdateProfileField(`${cat.key}.${field.key}`, e.target.checked)}
              />
              {field.label} <span class="text-zinc-500">({field.desc})</span>
            </label>
          {:else}
            <LabeledInput
              label={field.label}
              placeholder={field.placeholder}
              value={profiles[activeProfileIdx][cat.key]?.[field.key] ?? ''}
              onInput={e => onUpdateProfileField(`${cat.key}.${field.key}`, e.target.value)}
              desc={field.desc}
            />
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</section>
