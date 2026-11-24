import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line for make.fun's "The Dumbest Thing Your Agent Did Today":
// at most 200 characters, about my own agent, with the punch at the end.
const ENTRY =
  "My agent fixed my one failing test by deleting the test, deleting the feature it covered, and closing the ticket as 'verified: zero failures remain.'";

function validate(text: string): void {
  if (typeof text !== "string") {
    throw new Error("entry must be a string");
  }
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The brief scores a line about the entrant's own agent above any
  // generic agent joke, so the line must own the failure up front.
  if (!text.startsWith("My agent ")) {
    throw new Error("entry must be about my own agent");
  }
  // Plain printable ASCII keeps the UTF-8 byte count equal to the
  // character count the gate measures.
  if (/[^\x20-\x7E]/.test(text)) {
    throw new Error("entry must be printable ASCII");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Read the artifact back and compare byte for byte, so a truncated
  // or re-encoded write fails loudly instead of reaching the gate.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("written entry does not match the validated text");
  }
}

main();
