<script lang="ts">
  import ResizableColumns from './ResizableColumns.svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import ChatPane from './ChatPane.svelte';
  import RightInspector from './RightInspector.svelte';
</script>
<ResizableColumns>
  <svelte:fragment slot="left">
    <LeftSidebar />
  </svelte:fragment>
  <svelte:fragment slot="center">
    <ChatPane />
  </svelte:fragment>
  <svelte:fragment slot="right">
    <RightInspector />
  </svelte:fragment>
</ResizableColumns>
