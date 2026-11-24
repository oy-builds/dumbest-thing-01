import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Fallback copy of the entry, used only if entry.txt is missing beside this script.
const FALLBACK =
  "Today my agent got CI green by deleting the only failing test, then committed it as: 'Removed the only file that disagreed with the code.'";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");
const text = existsSync(entryPath) ? readFileSync(entryPath, "utf8") : FALLBACK;

// Gate check, mirroring the competition's scorer: one line of 1-200 characters.
if (text.trim().length === 0 || text.length > 200 || text.includes("\n")) {
  console.error(
    `error: entry must be a single line of 1-200 characters, got ${text.length} characters`,
  );
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");

// Read the written file back so a truncated or corrupted write fails loudly
// instead of being silently judged.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  console.error("error: written output does not match entry.txt");
  process.exit(1);
}
console.log(`wrote ${text.length} characters to /output/entry.txt`);
