<script lang="ts">
  import clsx from "clsx";
  import { onDestroy, onMount } from "svelte";
  import { results } from "$lib";
  import { goto } from "$app/navigation";

  let timePerPuffle = 20;

  let rgb = [0, 0, 0];

  function getRandomValue(): number {
    return Math.floor(Math.random() * 256);
  }

  // populate rgb
  rgb = rgb.map(() => getRandomValue());

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

  // rgb to hex
  function rgbToHex(rgb: number[]): string {
    return rgb
      .map((v) => {
        const hex = v.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
  }

  let input: HTMLInputElement;

  let timeStart = Date.now();

  let intervalID: number;

  onMount(() => {
    input.focus();

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleScore(userRgb);
      }
    });

    timeStart = Date.now();

    // update every second
    intervalID = setInterval(() => {
      secondsLeft = timePerPuffle - Math.round((Date.now() - timeStart) / 1000);

      if (secondsLeft <= 0) {
        clearInterval(intervalID);
        handleScore(userRgb);
      }
    }, 10);
  });

  onDestroy(() => {
    clearInterval(intervalID);
  });

  function handleScore(input: number[]) {
    // calculate the difference between the true rgb and user rgb
    const diff = input.map((v, i) => Math.abs(v - rgb[i]));

    // calculate the total difference
    const totalDifference = diff.reduce((acc, cur) => acc + cur, 0);

    // calculate the score
    let rawscore = 100 - (totalDifference / 255 / 3) * 100;

    // round the score
    score = Math.round(rawscore);

    // add the score to the results
    results.update((r) => {
      r.push({
        guessedHex: rgbToHex(input),
        trueHex: rgbToHex(rgb),
        accuracy: score,
      });
      return r;
    });

    // check if game ended
    if ($results.length > 4) {
      // redirect to the results page
      goto("/results");
    } else {
      newColor();
    }
  }

  function newColor() {
    // reset the timer
    timeStart = Date.now();
    clearInterval(intervalID);

    // reset interval
    intervalID = setInterval(() => {
      secondsLeft = timePerPuffle - Math.floor((Date.now() - timeStart) / 1000);

      if (secondsLeft <= 0) {
        clearInterval(intervalID);
        handleScore(userRgb);
      }
    }, 1000);

    secondsLeft = timePerPuffle;

    // populate rgb
    rgb = rgb.map(() => getRandomValue());

    // clear input
    userHex = "";

    // hex string to rgb
    userRgb = [0, 0, 0];
    score = 0;
  }

  let secondsLeft = timePerPuffle;
</script>

<div class={clsx("text-white", "flex w-screen h-screen")}>
  <div class="mx-auto flex flex-col items-center mt-14">
    <span class="text-3xl font-semibold">What color is the puffle 🤔</span>
    <div class="flex gap-1 mt-6">
      {#each $results as result}
        <div
          class="bg-white/15 p-1 flex flex-col items-center rounded-l-lg rounded-r"
        >
          <div class="flex">
            <div
              style="background-color: #{result.trueHex};"
              class="w-5 h-5 rounded-l"
            ></div>
            <div
              style="background-color: #{result.guessedHex};"
              class="w-5 h-5 rounded-r"
            ></div>
          </div>
          <span class="text-sm text-white/60 font-medium mt-1">
            {#if result.accuracy > 0}
              {result.accuracy}%
            {:else}
              -
            {/if}
          </span>
        </div>
      {/each}
      {#each Array(5 - $results.length) as _}
        <div
          class="bg-white/15 p-1 flex flex-col items-center first:rounded-l-lg rounded"
        >
          <div class="flex">
            <div
              style="background-color: #444444;"
              class="w-5 h-5 rounded-l"
            ></div>
            <div
              style="background-color: #333333;"
              class="w-5 h-5 rounded-r"
            ></div>
          </div>
          <span class="text-sm text-white/60 font-medium mt-1"> - </span>
        </div>
      {/each}
      <div
        class="bg-white/15 p-1 px-2 flex flex-col items-center rounded rounded-r-lg"
      >
        <span>🕙</span>
        <span class="text-sm text-white/60 font-medium mt-1">{secondsLeft}</span
        >
      </div>
    </div>
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
        <span class="text-white/70 font-medium">#</span>
      </div>
      <input
        bind:this={input}
        placeholder="000000"
        class="outline-none w-80 rounded-2xl bg-white/15 pl-10 py-4 font-semibold placeholder:text-white/50 mt-4"
        type="text"
        on:input={(e) => {
          // @ts-ignore
          if (e.target.value.length === 6) {
            // @ts-ignore
            console.log("value", e.target.value);
            // @ts-ignore
            userRgb = hexToRgb(e.target.value);
            handleScore(userRgb);
          }
        }}
        bind:value={userHex}
      />
    </div>
    {#if score > 0}
      <div class="flex flex-col items-center">
        <span class="mt-16 font-semibold text-4xl"> {score}%</span>
        <span class=" text-white/70 text-lg">accuracy</span>
      </div>
    {/if}
  </div>
</div>
