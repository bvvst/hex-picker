<script>
  import { env } from "$env/dynamic/public";

  export let data;
  console.log(data.id);
</script>

<svelte:head>
  <title>bruh moment</title>
  <meta property="og:title" content="Check out my hex color score!" />
  <meta property="og:image" content="{env.PUBLIC_BACKEND_URL}/{data.id}" />
  <meta property="og:description" content="Guess hex colors!" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Check out my hex color score!" />
  <meta name="twitter:description" content="Guess hex colors!" />
  <meta name="twitter:image" content="{env.PUBLIC_BACKEND_URL}/{data.id}" />
  <meta name="twitter:image:src" content="{env.PUBLIC_BACKEND_URL}/{data.id}" />
  <meta name="twitter:site" content="@bvvst" />
</svelte:head>

<h1>hi</h1>
