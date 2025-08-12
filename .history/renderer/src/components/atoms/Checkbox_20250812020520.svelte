<script lang="ts">
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let id: string = '';
  export let name: string = '';
  export let value: string = '';
  export let className: string = '';
  export let onChange: (e: Event) => void = () => {};
</script>

<input
  type="checkbox"
  id={id}
  name={name}
  value={value}
  checked={checked}
  disabled={disabled}
  on:change={onChange}
  class={`relative h-5 w-5 shrink-0 cursor-pointer
          appearance-none rounded-md
          border border-zinc-500/50
          bg-gradient-to-b from-zinc-900 to-zinc-800
          shadow-inner ring-1 ring-inset ring-black/20
          transition-all duration-200

          hover:brightness-[1.05] hover:border-zinc-300/70
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60

          checked:bg-blue-600 checked:border-blue-500
          checked:ring-blue-500/30
          checked:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]

          disabled:opacity-50 disabled:cursor-not-allowed

          dark:from-zinc-900 dark:to-zinc-900
          dark:border-zinc-600/60 dark:ring-white/5
          dark:hover:border-zinc-400/70

          /* 체크마크(의사요소) */
          before:content-[''] before:absolute before:left-1.5 before:top-0.5
          before:h-2.5 before:w-1.25
          before:rotate-45 before:scale-0 before:opacity-0
          before:border-b-2 before:border-r-2 before:border-white
          before:transition-transform before:duration-200
          checked:before:scale-100 checked:before:opacity-100

          /* 살짝 빛나는 테두리 효과 */
          after:content-[''] after:absolute after:inset-0 after:rounded-md
          after:ring-1 after:ring-white/10
          ${className}`}
/>
