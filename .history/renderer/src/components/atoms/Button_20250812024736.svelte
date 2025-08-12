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
  class={`btn ${
    size === 'sm' ? 'btn-xs' : size === 'lg' ? 'btn-lg' : 'btn-md'
  } ${
    variant === 'solid' && color === 'primary' ? 'btn-primary' :
    variant === 'solid' && color === 'danger' ? 'btn-error' :
    variant === 'solid' && color === 'success' ? 'btn-success' :
    variant === 'solid' && color === 'default' ? 'btn-neutral' :
    variant === 'outline' ? 'btn-outline' :
    variant === 'ghost' ? 'btn-ghost' : ''
  } ${className}`}
  {...$$restProps}
>
  <slot />
</button>
