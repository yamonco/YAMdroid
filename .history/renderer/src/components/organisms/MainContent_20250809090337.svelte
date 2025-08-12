<script>
  import Title from "../atoms/Title.svelte";
  import InfoSection from "../molecules/InfoSection.svelte";

  function openDevTools() {
    window.electronAPI.openDevTools();
  }
</script>

<div class="min-h-screen bg-base-200 p-4">
  <div class="max-w-4xl mx-auto">
    <Title>
      <span class="text-2xl md:text-4xl font-bold">유틸리티 툴 모음</span>
    </Title>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <!-- 예시 유틸 카드 1 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">DevTools 열기</h2>
          <p>Electron 개발자 도구를 바로 실행합니다.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" type="button" on:click={openDevTools}>실행</button>
          </div>
        </div>
      </div>
      <!-- 예시 유틸 카드 2 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">앱 정보</h2>
          <p>앱의 버전, Node/Electron 버전 등 정보를 확인합니다.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-secondary" type="button">정보 보기</button>
          </div>
        </div>
      </div>
      <!-- 예시 유틸 카드 3 (추가 가능) -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">기타 유틸리티</h2>
          <p>다양한 유틸리티 기능을 여기에 추가할 수 있습니다.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-accent" type="button">실행</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
