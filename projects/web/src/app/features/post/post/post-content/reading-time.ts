const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(html: string | null | undefined): number {
  const words = (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
