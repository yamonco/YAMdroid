<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let disabled: boolean = false;
  export let className: string = '';
</script>
<button type={type} class={className} disabled={disabled}>
  <slot />
</button>
