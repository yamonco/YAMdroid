<script>
  import MainContent from './components/organisms/MainContent.svelte';
  import './app.css';
</script>

<div class="h-screen w-screen flex flex-col bg-zinc-950">
  <!-- 최상단 헤더 -->
  <header class="h-11 flex items-center px-4 bg-zinc-900 border-b border-zinc-800 text-zinc-200 font-bold text-lg select-none">
    Electron + Svelte Template
  </header>
  <!-- 3단 메인 컨텐츠 -->
  <div class="flex-1 min-h-0">
    <MainContent />
  </div>
</div>
