import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthProvider';
import { authService } from '../../../auth/authService';

export function AuthCallback() {
  const navigate   = useNavigate();
  const { restoreSession } = useAuth();
  const attempted  = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const errParam = params.get('error');

    console.log('[AuthCallback] mounted — search:', window.location.search);

    if (errParam) {
      const desc = params.get('error_description') ?? errParam;
      console.error('[AuthCallback] Cognito returned an error:', errParam, desc);
      setError(desc);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
      return;
    }

    if (!code) {
      console.error('[AuthCallback] No authorization code found in URL.');
      navigate('/login', { replace: true });
      return;
    }

    console.log('[AuthCallback] Authorization code received, starting token exchange…');

    authService
      .exchangeCode(code)
      .then(async () => {
        const restored = await restoreSession();
        if (!restored) {
          throw new Error('Session restore failed after token exchange.');
        }
        console.log('[AuthCallback] Token exchange and session restore succeeded — navigating to dashboard.');
        window.location.replace('/');
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[AuthCallback] Token exchange failed:', msg);
        setError(msg);
        setTimeout(() => window.location.replace('/login'), 3000);
      });
  }, [navigate, restoreSession]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-6">
        <p className="text-destructive font-semibold text-center">Sign-in failed</p>
        <p className="text-muted-foreground text-sm text-center max-w-sm">{error}</p>
        <p className="text-muted-foreground text-xs">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
      <p className="text-muted-foreground text-sm">Completing sign-in…</p>
    </div>
  );
}
