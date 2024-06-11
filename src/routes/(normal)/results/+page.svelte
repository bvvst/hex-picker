<script lang="ts">
  import clsx from "clsx";
  import { results } from "$lib";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";

  let accuracy = 0;

  let copied = false;
  let loading = false;

  onMount(() => {
    // if there are no results, redirect to play
    if ($results.length === 0) {
      goto("/");
    }
    // calculate average accuracy
    const total = $results.reduce((acc, result) => acc + result.accuracy, 0);
    accuracy = total / $results.length;
  });

  let url = "";

  async function handleShare() {
    if (url !== "") {
      return;
    }
    loading = true;
    const colorArray: string[] = [];
    $results.forEach((result) => {
      colorArray.push(result.guessedHex, result.trueHex); // Add both guessed and true colors to the array
    });

    // send results to backend
    const dataToSend = {
      userID: 0,
      accuracy: accuracy,
      gameMode: "normal", // You need to define the game mode appropriately
      data: colorArray.slice(0, 10),
    };

    try {
      const response = await fetch(env.PUBLIC_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, ${errorData.message}`
        );
      }

      type ResponseData = {
        id: string;
      };

      const r: ResponseData = await response.json();
      console.log("Success:", r);

      url = `${window.location.origin}/share/${r.id}`;

      // copy share page link to clipboard
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/share/${r.id}`
        );
        copied = true;
      } catch (clipError) {
        console.error("Clipboard Error:", "clipError.message");
        copied = false;
      }

      loading = false;
    } catch (error) {
      console.error("Error:", "error.message");
    }
  }
</script>

<div class={clsx("text-white", "flex w-screen h-screen")}>
  <div class="mx-auto flex flex-col items-center mt-14">
    <span class="text-3xl font-semibold">Nicely done!</span>
    <div class="flex gap-1 mt-6">
      {#each $results as result}
        <div
          class="bg-white/15 p-1 flex flex-col items-center first:rounded-l-lg rounded last:rounded-r-lg"
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
    </div>
    <div class="w-40 h-40 mt-7 rounded-2xl bg-white">
      <img class="pointer-events-none select-none" src="puffle.png" alt="" />
    </div>
    <span class="text-2xl mt-10 font-medium">{accuracy}%</span>
    <span class="text-white/80 max-w-sm text-center">Overall Accuracy</span>
    <button
      on:click={handleShare}
      class={clsx(
        loading ? "bg-white/5" : "bg-white/10",
        "text-white w-80 h-14 border border-white/5  py-1.5 rounded-2xl mt-6 font-medium text-xl transition hover:bg-white/15 active:translate-y-1"
      )}
    >
      {#if loading}
        Loading...
      {:else if copied}
        Copied!
      {:else}
        Share
      {/if}
    </button>
    <button
      on:click={() => {
        results.set([]);
        goto("/play");
      }}
      class="text-black flex items-center justify-center w-80 h-14 bg-white py-1.5 rounded-2xl mt-2 font-medium text-xl transition hover:bg-white/90 active:translate-y-1"
      >Play Again</button
    >
  </div>
</div>
