import { authConfig } from './authConfig';

const STORAGE_KEYS = {
  accessToken:   'vv_access_token',
  idToken:       'vv_id_token',
  refreshToken:  'vv_refresh_token',
  expiresAt:     'vv_expires_at',
  codeVerifier:  'vv_pkce_verifier',
} as const;

export interface TokenSet {
  accessToken:  string;
  idToken:      string;
  refreshToken: string;
  expiresAt:    number; // epoch ms
}

export interface CognitoUser {
  sub:           string;
  phone_number?: string;
  email?:        string;
  name?:         string;
}

// ─── PKCE helpers ────────────────────────────────────────────────────────────

function generateRandomString(length = 64): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Base64Url(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ─── JWT helper ──────────────────────────────────────────────────────────────

function parseJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  /** Redirect to Cognito Hosted UI login page (PKCE flow) */
  async login() {
    const verifier  = generateRandomString(64);
    const challenge = await sha256Base64Url(verifier);

    sessionStorage.setItem(STORAGE_KEYS.codeVerifier, verifier);

    const params = new URLSearchParams({
      client_id:             authConfig.clientId,
      response_type:         'code',
      scope:                 authConfig.scopes,
      redirect_uri:          authConfig.redirectUri,
      code_challenge_method: 'S256',
      code_challenge:        challenge,
    });

    const url = `${authConfig.authorizeUrl}?${params}`;
    window.location.href = url;
  },

  /** Clear tokens and redirect to Cognito logout endpoint */
  logout() {
    authService.clearTokens();
    const params = new URLSearchParams({
      client_id:  authConfig.clientId,
      logout_uri: authConfig.logoutUri,
    });
    window.location.href = `${authConfig.logoutUrl}?${params}`;
  },

  /** Exchange an authorization code for tokens (PKCE) */
  async exchangeCode(code: string): Promise<TokenSet> {
    const verifier = sessionStorage.getItem(STORAGE_KEYS.codeVerifier);
    if (!verifier) {
      throw new Error('PKCE code_verifier not found. Please restart the login flow.');
    }

    const body = new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     authConfig.clientId,
      code,
      redirect_uri:  authConfig.redirectUri,
      code_verifier: verifier,
    });

    const response = await fetch(authConfig.tokenUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Token exchange failed (${response.status}): ${err}`);
    }

    const data = await response.json();

    sessionStorage.removeItem(STORAGE_KEYS.codeVerifier);

    const tokens: TokenSet = {
      accessToken:  data.access_token,
      idToken:      data.id_token,
      refreshToken: data.refresh_token,
      expiresAt:    Date.now() + data.expires_in * 1000,
    };
    authService.storeTokens(tokens);
    return tokens;
  },

  /** Attempt to refresh the access token using the stored refresh token */
  async refreshTokens(): Promise<TokenSet | null> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) return null;

    const body = new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     authConfig.clientId,
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(authConfig.tokenUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    body.toString(),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const tokens: TokenSet = {
        accessToken:  data.access_token,
        idToken:      data.id_token,
        refreshToken: data.refresh_token ?? refreshToken,
        expiresAt:    Date.now() + data.expires_in * 1000,
      };
      authService.storeTokens(tokens);
      return tokens;
    } catch {
      return null;
    }
  },

  storeTokens(tokens: TokenSet) {
    localStorage.setItem(STORAGE_KEYS.accessToken,  tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.idToken,      tokens.idToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.expiresAt,    String(tokens.expiresAt));
    // Keep legacy key used by api.ts
    localStorage.setItem('accessToken', tokens.accessToken);
  },

  clearTokens() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem(STORAGE_KEYS.codeVerifier);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  },

  isTokenExpired(): boolean {
    const exp = localStorage.getItem(STORAGE_KEYS.expiresAt);
    if (!exp) return true;
    return Date.now() > Number(exp) - 60_000; // 60s buffer
  },

  isAuthenticated(): boolean {
    return !!authService.getAccessToken() && !authService.isTokenExpired();
  },

  getUser(): CognitoUser | null {
    const idToken = localStorage.getItem(STORAGE_KEYS.idToken);
    if (!idToken) return null;
    const payload = parseJwtPayload(idToken);
    return {
      sub:          payload.sub as string,
      phone_number: payload.phone_number as string | undefined,
      email:        payload.email as string | undefined,
      name:         (payload.name ?? payload.phone_number) as string | undefined,
    };
  },
};
