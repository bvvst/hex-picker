<script lang="ts">
  import clsx from "clsx";
</script>

<div class={clsx("text-white", "flex w-screen h-screen")}>
  <div class="mx-auto flex flex-col items-center mt-14">
    <span class="text-3xl font-semibold">What color is the puffle 🤔</span>
    <div class="w-40 h-40 mt-7 rounded-2xl bg-white">
      <img class="pointer-events-none select-none" src="puffle.png" alt="" />
    </div>
    <span class="text-white/80 mt-10 max-w-sm text-center"
      >Go head to head with someone to guess five hex codes. You have 10 seconds
      per puffle.</span
    >
    <a
      href="/play"
      class="text-black flex items-center justify-center w-80 h-14 bg-white py-1.5 rounded-2xl mt-6 font-medium text-xl transition hover:bg-white/90 active:translate-y-1"
      >Play</a
    >
    <button
      class="text-white w-80 h-14 border border-white/5 bg-white/10 py-1.5 rounded-2xl mt-2 font-medium text-xl transition hover:bg-white/15 active:translate-y-1"
      >Play Robot</button
    >
  </div>
</div>
