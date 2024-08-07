<script>
  export let val = 0;
</script>

<div class="w-full">
  <input class="slider" max="255" bind:value={val} type="range" />
</div>
