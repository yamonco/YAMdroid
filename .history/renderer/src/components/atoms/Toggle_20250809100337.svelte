<script lang="ts">
  export let checked = false;
</script>
<div class={`h-4 w-7 rounded-full transition ${checked ? 'bg-blue-500' : 'bg-zinc-700'}`}>
  <div class={`h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-3' : 'translate-x-0'}`}></div>
</div>
