<script lang="ts">
  import TopTabs from '../molecules/TopTabs.svelte';
  import ModelBar from '../molecules/ModelBar.svelte';
  import Kbd from '../atoms/Kbd.svelte';
  import Input from '../atoms/Input.svelte';
  import Button from '../atoms/Button.svelte';
  let tabs = ['Context', 'Model', 'Program'];
  let activeTab = 2;
  let model = 'openai/gpt-oss-20b';
  let input = '';
</script>
<div class="min-w-0 flex-1 flex flex-col">
  <TopTabs {tabs} {activeTab} onTab={(idx) => activeTab = idx} />
  <ModelBar {model}>
    <Kbd slot="kbd">Ctrl + L</Kbd>
    <Button slot="action" title="Eject"><svg viewBox="0 0 24 24" class="h-4 w-4 fill-zinc-300"><path d="M12 6l8 8H4l8-8zm8 10H4v2h16v-2z"/></svg></Button>
  </ModelBar>
  <div class="flex-1 overflow-y-auto bg-zinc-950 p-4">
    <div class="space-y-4">
      {#each Array(5) as _, i}
        <div class="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-200">
          <div class="mb-2 text-xs text-zinc-400">User {i+1}</div>
          <div>이곳에 채팅 메시지가 표시됩니다.</div>
        </div>
      {/each}
    </div>
  </div>
  <div class="border-t border-zinc-800 bg-zinc-900 px-4 py-2 flex items-center gap-2">
    <Input className="flex-1" placeholder="메시지 입력..." bind:value={input} />
    <Button>전송</Button>
  </div>
</div>
