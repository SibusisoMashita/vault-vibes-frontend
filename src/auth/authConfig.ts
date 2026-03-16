// Public SPA client — no client secret (created 2026-03-14)
const CLIENT_ID   = '79kvqh819qcj0kojp3560jvj1';
const DOMAIN      = 'https://auth.vaultvibes.co.za';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const LOGOUT_URI   = `${window.location.origin}/login`;

const SCOPES = 'openid profile email';

export const authConfig = {
  clientId:     CLIENT_ID,
  domain:       DOMAIN,
  redirectUri:  REDIRECT_URI,
  logoutUri:    LOGOUT_URI,
  scopes:       SCOPES,
  authorizeUrl: `${DOMAIN}/oauth2/authorize`,
  tokenUrl:     `${DOMAIN}/oauth2/token`,
  logoutUrl:    `${DOMAIN}/logout`,
} as const;
