<script>
  import Title from "../atoms/Title.svelte";
  import InfoSection from "../molecules/InfoSection.svelte";

  function openDevTools() {
    window.electronAPI.openDevTools();
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <Title>Welcome to Electron + Svelte</Title>
  <InfoSection>
    <span slot="info">이곳에 설명 텍스트를 넣으세요.</span>
    <span slot="button" on:click={openDevTools}>DevTools 열기</span>
  </InfoSection>
</div>
