/**
 * next/link and next/image apply `basePath` automatically; a raw <img src> or a
 * hand-written URL does not. Wrap those in `asset()` so they keep working when
 * the site is published under a subpath (GitHub Pages project sites).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
