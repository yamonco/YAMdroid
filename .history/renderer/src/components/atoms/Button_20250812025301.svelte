<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let className: string = '';
  // 모든 스타일은 DaisyUI/Tailwind에서 직접 지정, 내부에서 버튼 컴포넌트 참조 금지
</script>
<button
  type={type}
  class={className}
  {...$$restProps}
>
  <slot />
</button>
