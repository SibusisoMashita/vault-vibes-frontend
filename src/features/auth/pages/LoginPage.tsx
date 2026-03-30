import { useAuth } from '../../../auth/AuthProvider';

export function LoginPage() {
  const { login, sessionExpired } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mb-4">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vault Vibes</h1>
          <p className="text-slate-400 mt-2 text-sm">Members-only savings collective</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
          {sessionExpired && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
              Your session has expired. Please sign in again.
            </div>
          )}
          <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in with your Vault Vibes account to continue.</p>

          <button
            onClick={login}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all duration-150 shadow-md"
          >
            Sign in
          </button>

          <p className="text-center text-xs text-slate-500 mt-6">
            Access is by invitation only. Contact your group admin.
          </p>
        </div>
      </div>
    </div>
  );
}
