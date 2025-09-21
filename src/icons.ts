/**
 * Helper to resolve custom SVG icons placed under ./assets/cline-icons
 * Usage:
 *   const homeUrl = getIconUrl(['home', 'главная']);
 *   <IonIcon {...(homeUrl ? { src: homeUrl } : { icon: homeOutline })} />
 */
const files = import.meta.glob('./assets/cline-icons/*.svg', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

function baseName(path: string): string {
  const slash = path.replace(/\\/g, '/').split('/').pop() || '';
  return slash.replace(/\.svg$/i, '');
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD') // strip accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[_-]+/g, '')
    .trim();
}

/**
 * Try to find an icon URL by candidate names (case/locale insensitive).
 * Matches exact normalized basename first, then substring includes.
 */
export function getIconUrl(candidates: string[]): string | undefined {
  const entries = Object.entries(files).map(([p, url]) => ({
    path: p,
    url,
    name: baseName(p),
    norm: normalize(baseName(p)),
  }));

  const normCandidates = candidates.map((c) => normalize(c));

  // Exact match by normalized basename
  for (const nc of normCandidates) {
    const hit = entries.find((e) => e.norm === nc);
    if (hit) return hit.url;
  }

  // Substring includes (fallback)
  for (const nc of normCandidates) {
    const hit = entries.find((e) => e.norm.includes(nc) || nc.includes(e.norm));
    if (hit) return hit.url;
  }

  return undefined;
}
