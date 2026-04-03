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

    if (errParam) {
      const desc = params.get('error_description') ?? errParam;
      setError(desc);
      return;
    }

    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    authService
      .exchangeCode(code)
      .then(async () => {
        const restored = await restoreSession();
        if (!restored) {
          throw new Error('Session restore failed after token exchange.');
        }
        window.location.replace('/app/dashboard');
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      });
  }, [navigate, restoreSession]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-6">
        <p className="text-destructive font-semibold text-center">Sign-in failed</p>
        <p className="text-muted-foreground text-sm text-center max-w-sm">{error}</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          Back to login
        </button>
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
