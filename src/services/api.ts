const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function authToken(): string | null {
  return localStorage.getItem('vv_id_token') ?? localStorage.getItem('accessToken');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Use the Cognito ID token — it carries user claims (sub, phone_number) needed
  // for first-login account linking on the backend. Falls back to access token.
  const token = authToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  // Return null for 204 No Content
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

/**
 * Multipart POST — does NOT set Content-Type so the browser supplies the
 * correct boundary for the multipart body.
 */
async function requestMultipart<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = authToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  postMultipart: <T>(path: string, formData: FormData) => requestMultipart<T>(path, formData),
};
