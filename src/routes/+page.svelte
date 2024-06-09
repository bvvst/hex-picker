<script lang="ts">
  import clsx from "clsx";

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
</script>

<div
  class="flex w-screen h-screen"
  style="background-color: rgb({rgb[0]}, {rgb[1]},{rgb[2]})"
>
  <div class="m-auto flex flex-col items-center">
    <span class="text-white">guess the color hex</span>
    <div
      class="flex mt-4 w-44 relative border border-black/5 bg-black/5 items-center rounded gap-0.5 px-2 py-1 text-4xl"
    >
      <span class="text-white/30">#</span>
      <input
        placeholder="000000"
        class="placeholder:text-white/30 bg-transparent outline-none w-full text-white"
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
    <span class="text-white mt-4">score: {score}</span>
  </div>
</div>
