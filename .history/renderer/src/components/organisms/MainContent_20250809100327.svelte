<script lang="ts">
  import ResizableColumns from './ResizableColumns.svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import ChatPane from './ChatPane.svelte';
  import RightInspector from './RightInspector.svelte';
</script>
<ResizableColumns
  left={<LeftSidebar />}
  center={<ChatPane />}
  right={<RightInspector />}
/>
