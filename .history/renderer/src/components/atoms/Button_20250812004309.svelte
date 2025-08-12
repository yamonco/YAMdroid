<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'solid' | 'outline' | 'ghost' = 'solid';
  export let color: 'primary' | 'danger' | 'default' | 'success' = 'default';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let className: string = '';
  // 이벤트 및 기타 속성은 $$restProps로 전달
</script>
<button
  type={type}
  class={`
    inline-flex items-center justify-center font-semibold transition focus:outline-none
    rounded 
    ${size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'}
  ${variant === 'solid' && color === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
  ${variant === 'solid' && color === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
  ${variant === 'solid' && color === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
  ${variant === 'solid' && color === 'default' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : ''}
    ${variant === 'outline' ? 'border-2 bg-transparent' : ''}
    ${variant === 'outline' && color === 'primary' ? 'border-blue-500 text-blue-500 hover:bg-blue-50/10' : ''}
    ${variant === 'outline' && color === 'danger' ? 'border-red-500 text-red-500 hover:bg-red-50/10' : ''}
    ${variant === 'outline' && color === 'default' ? 'border-zinc-500 text-zinc-200 hover:bg-zinc-50/5' : ''}
  ${variant === 'ghost' && color === 'success' ? 'bg-transparent text-green-300 border border-zinc-700 hover:bg-zinc-700' : ''}
  ${variant === 'ghost' && color !== 'success' ? 'bg-transparent text-zinc-300 hover:bg-zinc-800/40' : ''}
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `}
  {...$$restProps}
>
  <slot />
</button>
