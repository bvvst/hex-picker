<script lang="ts">
  import clsx from "clsx";
  import { onMount } from "svelte";
  import Refresh from "$lib/assets/refresh.svg";

  let rgb = [0, 0, 0];

  function getRandomValue(): number {
    return Math.floor(Math.random() * 256);
  }

  // populate rgb
  rgb = rgb.map(() => getRandomValue());

  // rgb to hex
  function rgbToHex(rgb: number[]): string {
    return `${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }

  let trueHex = rgbToHex(rgb);
  let userHex = "";

  // hex string to rgb
  function hexToRgb(hex: string): number[] {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  let userRgb = [0, 0, 0];
  let score = 0;

  // check if color is light or dark
  function isLight(color: number[]): boolean {
    return color.reduce((a, b) => a + b) > 382.5;
  }

  let input: HTMLInputElement;

  onMount(() => {
    input.focus();
  });
</script>

<div class={clsx("text-white", "flex w-screen h-screen")}>
  <div class="mx-auto flex flex-col items-center mt-10">
    <span class="text-3xl font-semibold">What color is the puffle 🤔</span>
    <div
      class="w-40 h-40 mt-7 rounded-2xl"
      style="background-color: rgb({rgb[0]}, {rgb[1]},{rgb[2]})"
    >
      <img class="pointer-events-none select-none" src="puffle.png" alt="" />
    </div>
    <div class="mt-4 relative text-3xl">
      <div
        class="pointer-events-none absolute mt-4 inset-y-0 left-0 flex items-center pl-6"
      >
        <span class="text-white/50 font-medium">#</span>
      </div>
      <input
        bind:this={input}
        placeholder="000000"
        class="outline-none w-80 rounded-2xl bg-white/10 pl-10 py-4 font-semibold placeholder:text-white/50 mt-4"
        type="text"
        on:input={(e) => {
          // @ts-ignore
          if (e.target.value === trueHex) {
            alert("You got it!");
            // @ts-ignore
          }

          // maximum 6 characters
          // @ts-ignore
          if (e.target.value.length > 6) {
            // @ts-ignore
            e.target.value = e.target.value.slice(0, 6);
          }

          // convert hex to rgb if input is 6 characters
          // @ts-ignore
          if (e.target.value.length === 6) {
            console.log("calculating score");
            // @ts-ignore
            userRgb = hexToRgb(e.target.value);

            // calculate the difference between the true rgb and user rgb
            const diff = userRgb.map((v, i) => Math.abs(v - rgb[i]));

            // calculate the total difference
            const totalDifference = diff.reduce((acc, cur) => acc + cur, 0);

            // calculate the score
            let rawscore = 100 - (totalDifference / 255 / 3) * 100;

            // round the score
            score = Math.round(rawscore);
            console.log(score);
          }
        }}
        bind:value={userHex}
      />
    </div>
    <button
      class="text-black w-80 h-14 border border-white/5 bg-white py-1.5 rounded-2xl mt-2 font-medium text-xl transition hover:bg-white/90 active:translate-y-1"
      >Submit 🧠</button
    >
    <button
      on:click={() => {
        // populate rgb
        rgb = rgb.map(() => getRandomValue());

        // rgb to hex
        trueHex = rgbToHex(rgb);
        userHex = "";

        // hex string to rgb
        userRgb = [0, 0, 0];
        score = 0;
      }}
      class="flex text-white/80 w-80 h-14 bg-white/10 py-1.5 rounded-2xl mt-2 text-xl transition hover:bg-white/15 active:translate-y-1"
      ><img class="m-auto" src={Refresh} alt="" /></button
    >
    {#if score > 0}
      <div class="flex flex-col items-center">
        <span class="mt-16 font-semibold text-4xl"> {score}%</span>
        <span class=" text-white/70 text-lg">accuracy</span>
      </div>
    {/if}
  </div>
</div>
