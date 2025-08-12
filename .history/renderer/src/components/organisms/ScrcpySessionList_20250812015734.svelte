<script lang="ts">
  import type { ScrcpySession } from '$lib/features/scrcpy/scrcpy.types';
  import Button from '@/components/atoms/Button.svelte';
  export let sessions: ScrcpySession[] = [];
  export let onToggleForeground: (session: ScrcpySession) => void;
  export let onKill: (session: ScrcpySession) => void;
</script>

{#if sessions.length > 0}
  <div class="w-full mb-6">
    <h2 class="text-lg font-bold mb-2 text-green-400">실행 중인 SCRCPY 세션</h2>
    <div class="flex flex-col gap-3">
      {#each sessions as session}
        <div class="bg-zinc-800 rounded-lg p-4 flex flex-col gap-2 border border-zinc-700 shadow">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-semibold text-blue-300">PID:</span> <span class="font-mono">{session.pid}</span>
              <span class="ml-4 font-semibold text-blue-300">경로:</span> <span class="font-mono">{session.folder}</span>
            </div>
            <div class="flex gap-2 ml-2">

                <Button
                  size="sm"
                  variant={session.foreground ? 'outline' : 'solid'}
                  color="primary"
                  onclick={() => onToggleForeground(session)}
                >
                  {session.foreground ? '백그라운드로' : '포그라운드로'}
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  color="danger"
                  onclick={() => onKill(session)}
                >
                  종료
                </Button>
            </div>
          </div>
          <div class="text-xs text-zinc-400">해상도: {session.resolution} / DPI: {session.dpi}</div>
        </div>
      {/each}
    </div>
  </div>
{/if}
