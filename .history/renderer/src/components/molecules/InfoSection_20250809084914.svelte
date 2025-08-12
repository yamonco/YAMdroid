<script>
  import Button from '../atoms/Button.svelte';
</script>

<div>
  <p>
    <slot name="info" />
  </p>
  <Button>
    <slot name="button" />
  </Button>
</div>
