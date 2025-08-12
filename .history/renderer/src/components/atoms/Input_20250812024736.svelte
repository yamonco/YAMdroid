<script lang="ts">
  export let placeholder = '';
  export let value = '';
  export let className: string = '';
  export let type: string = 'text';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let onInput: (e: Event) => void = () => {};

  // 선택: 상태 표시 (둘 중 하나만 true 권장)
  export let success: boolean = false;
  export let invalid: boolean = false;
</script>

<!--
  디자인 포인트
  - 둥근 모서리 + 약한 글라스 배경
  - 내부 그림자(shadow-inner)로 깊이감
  - hover 시 보더/배경 톤 상승
  - focus 링 + 보더 하이라이트
  - 성공/오류 상태 색상
  - light/dark 동시 대응
-->
<input
  type={type}
  class={`input input-bordered w-full ${
    size === 'sm' ? 'input-sm' : size === 'lg' ? 'input-lg' : 'input-md'
  } ${success ? 'input-success' : ''} ${invalid ? 'input-error' : ''} ${className}`}
  placeholder={placeholder}
  value={value}
  on:input={onInput}
  {...$$restProps}
/>
