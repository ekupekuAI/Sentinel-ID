// Only same-origin absolute paths are allowed as post-login destinations, so
// the ?next= parameter cannot be used as an open redirect ("//evil.com",
// "/\\evil.com", "javascript:").
export function safeRedirectPath(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || value.length > 512) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  if (value === '/login' || value.startsWith('/login?')) return fallback;
  return value;
}
