<script lang="ts">
  import ChatItem from './ChatItem.svelte';
  export let chats: {title: string, tokens: number}[] = [];
  export let activeIdx: number = 0;
  export let onSelect: (idx: number) => void = () => {};
</script>
<div class="space-y-1">
  {#each chats as chat, i}
    <ChatItem active={i===activeIdx} title={chat.title} tokens={chat.tokens} on:click={() => onSelect(i)} />
  {/each}
</div>
