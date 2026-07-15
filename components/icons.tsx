import type { ReactNode } from "react";

const symbols: Record<string, ReactNode> = { home: "⌂", book: "▤", words: "Aa", mistakes: "!", progress: "↗", settings: "⚙", search: "⌕", clock: "◷", flame: "◇", play: "▶", check: "✓", chevron: "›", sound: "♪", star: "☆", filter: "≡", cards: "▱", target: "◎", calendar: "▦", brain: "◉" };

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <span aria-hidden="true" className="icon" style={{ width: size, height: size, fontSize: Math.max(11, size - 3) }}>{symbols[name] ?? "·"}</span>;
}
