export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const payload = await response.json().catch(() => null) as { data?: T; error?: string } | null;
  if (!response.ok) throw new ApiError(payload?.error ?? 'Request failed.', response.status);
  return payload?.data as T;
}
