<script>
  import Title from "../atoms/Title.svelte";
  import InfoSection from "../molecules/InfoSection.svelte";

  function openDevTools() {
    window.electronAPI.openDevTools();
  }
</script>

<Title>Welcome to Electron + Svelte</Title>
<InfoSection>
  <span slot="info">이곳에 설명 텍스트를 넣으세요.</span>
  <span slot="button" on:click={openDevTools}>DevTools 열기</span>
</InfoSection>
