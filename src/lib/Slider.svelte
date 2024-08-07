<script lang="ts">
  export let width = 300;
  export let max = 255;
  export let value = 0;

  // on mouse move,
  // find the
  // set the value to the difference

  let slider: HTMLDivElement;

  function handleMouseMove(event: MouseEvent) {
    const sliderLeft = slider.getBoundingClientRect().left;
    let pos = event.clientX - sliderLeft;
    if (pos < 0) pos = 0;
    if (pos > width) pos = width;
    value = 255 * (pos / width);
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  function handleMouseDown() {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseEvent(event: MouseEvent) {
    const sliderLeft = slider.getBoundingClientRect().left;
    let pos = event.clientX - sliderLeft;
    if (pos < 0) pos = 0;
    if (pos > width) pos = width;

    // we have the position, so we can set the value relative to the position
    value = 255 * (pos / width);
  }
</script>

<div
  bind:this={slider}
  on:mousedown={handleMouseEvent}
  style="width: {width}px;"
  class="h-2 bg-white/20 mt-4 rounded-full relative"
  role="button"
  tabindex="0"
>
  <span>{value}</span>
  <div
    on:mousedown={handleMouseDown}
    style="transform: translateX({300 * (value / 255)}px);"
    class="absolute -top-1.5 h-5 bg-white w-3 rounded-sm cursor-pointer"
    role="slider"
    aria-valuemin="0"
    aria-valuemax={max}
    aria-valuenow={value}
    tabindex="0"
  ></div>
</div>
