/**
 * YouTube Utility Helper
 * Supports full URLs, short youtu.be URLs, embed URLs, and raw 11-char IDs.
 */

export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const clean = urlOrId.trim();
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  // Match standard YouTube patterns
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return clean;
}

export function getYouTubeEmbedUrl(urlOrId: string): string {
  const id = extractYouTubeId(urlOrId);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
}
