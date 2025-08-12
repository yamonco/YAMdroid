<script lang="ts">
  import ChatList from '../molecules/ChatList.svelte';
  let chats = Array.from({length: 10}, (_, i) => ({title: `Chat ${i+1}`, tokens: (i+1)*100}));
  let activeIdx = 0;
  function onSelect(idx: number) { activeIdx = idx; }
</script>
<div class="h-full bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col" style="width: 256px;">
  <div class="p-4 font-bold text-zinc-200">Chats</div>
  <div class="flex-1 overflow-y-auto space-y-1 px-2">
    <ChatList {chats} {activeIdx} {onSelect} />
  </div>
</div>
