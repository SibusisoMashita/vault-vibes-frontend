const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const REQUEST_TIMEOUT_MS = 30_000;

function authToken(): string | null {
  return localStorage.getItem('vv_access_token') ?? localStorage.getItem('accessToken');
}

async function request<T>(path: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Use the Cognito access token (token_use=access). Backend rejects ID tokens.
  const token = authToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: response.statusText }));
      const err = body.error ?? `Request failed: ${response.status}`;
      // Retry on server errors (5xx) only
      if (response.status >= 500 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 600 * (3 - retries)));
        return request<T>(path, options, retries - 1);
      }
      throw new Error(err);
    }

    // Return null for 204 No Content
    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    // Retry on network errors
    if (retries > 0 && err instanceof TypeError) {
      await new Promise(resolve => setTimeout(resolve, 600 * (3 - retries)));
      return request<T>(path, options, retries - 1);
    }
    throw err;
  }
}

/**
 * Multipart POST — does NOT set Content-Type so the browser supplies the
 * correct boundary for the multipart body.
 */
async function requestMultipart<T>(path: string, formData: FormData): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = {};
  const token = authToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(body.error ?? `Request failed: ${response.status}`);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  }
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
