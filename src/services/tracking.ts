/**
 * Tracking & Referral Service
 * Safeguard: Keep tracking scripts isolated so changes never cause DOM rendering errors.
 */

export function injectHeadScript(scriptId: string, scriptContent: string): void {
  try {
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.text = scriptContent;
    document.head.appendChild(script);
  } catch (error) {
    console.warn('[HeadScriptInjector] Non-blocking script injection warning:', error);
  }
}

export function detectReferralCode(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('profitnext_active_ref', ref.trim());
      return ref.trim();
    }
    return localStorage.getItem('profitnext_active_ref');
  } catch {
    return null;
  }
}

export function clearReferralCode(): void {
  try {
    localStorage.removeItem('profitnext_active_ref');
  } catch (err) {
    console.error(err);
  }
}
