// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";

type Result = {
  guessedHex: string;
  trueHex: string;
  accuracy: number;
};

const results = writable<Result[]>([]);

export { results };
