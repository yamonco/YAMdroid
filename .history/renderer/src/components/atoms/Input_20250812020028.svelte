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
  class={`w-full rounded-xl
          transition-colors duration-200 ease-out
          shadow-inner
          bg-white/80 text-zinc-900 border border-zinc-300
          placeholder:text-zinc-400
          hover:border-zinc-400 hover:bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
          disabled:opacity-60 disabled:cursor-not-allowed

          dark:bg-zinc-900/70 dark:text-zinc-100 dark:border-zinc-700/60
          dark:placeholder:text-zinc-500
          dark:hover:border-zinc-500/70 dark:hover:bg-zinc-900/80

          ${size === 'sm' ? 'h-9 px-3 text-sm'
            : size === 'lg' ? 'h-12 px-4 text-base'
            : 'h-10 px-3.5 text-sm'}

          ${success ? 'border-emerald-600 focus:ring-emerald-500/60 focus:border-emerald-600' : ''}
          ${invalid ? 'border-rose-600 focus:ring-rose-500/60 focus:border-rose-600' : ''}

          ${className}`}
  placeholder={placeholder}
  value={value}
  on:input={onInput}
  {...$$restProps}
/>
