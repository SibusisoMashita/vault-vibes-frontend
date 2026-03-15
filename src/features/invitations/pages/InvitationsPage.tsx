import { useEffect, useRef, useState } from 'react';
import { InvitationsService, Invitation } from '../../../services/invitationsService';
import { useApp } from '../../../app/providers';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { hasPermission, Permission } from '../../../auth/permissions';

const ROLES = ['MEMBER', 'TREASURER', 'CHAIRPERSON', 'ADMIN'];

const STATUS_COLORS: Record<string, string> = {
  PENDING:  'bg-yellow-400/10 text-yellow-500',
  ACCEPTED: 'bg-green-400/10 text-green-500',
  EXPIRED:  'bg-red-400/10 text-red-500',
};

export function InvitationsPage() {
  const { currentUser } = useApp();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const phoneRef      = useRef<HTMLInputElement>(null);
  const shareUnitsRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState('MEMBER');

  const canInvite = hasPermission(currentUser.role, Permission.INVITE_MEMBER);

  useSetPageHeader('Invitations');

  useEffect(() => {
    if (!canInvite) return;
    let cancelled = false;
    InvitationsService.list()
      .then(data => { if (!cancelled) setInvitations(data); })
      .catch(e  => { if (!cancelled) setError(e.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [canInvite]);

  if (!canInvite) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
          Access denied — Admin only.
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const phone      = phoneRef.current?.value.trim() ?? '';
    const shareUnits = parseFloat(shareUnitsRef.current?.value ?? '0');
    if (!phone) { setFormError('Phone number is required'); return; }
    if (!shareUnits || shareUnits <= 0) { setFormError('A member must be assigned at least part of a share.'); return; }

    setSubmitting(true);
    try {
      const inv = await InvitationsService.create(phone, role, shareUnits);
      setInvitations(prev => [inv, ...prev]);
      setSuccess(`Invitation sent to ${phone}`);
      if (phoneRef.current)      phoneRef.current.value = '';
      if (shareUnitsRef.current) shareUnitsRef.current.value = '';
      setRole('MEMBER');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create invitation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Create form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Invite a new member</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            ref={phoneRef}
            type="tel"
            placeholder="+27720000000"
            className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input
            ref={shareUnitsRef}
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Shares"
            className="w-24 px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Sending…' : 'Send Invite'}
          </button>
        </form>
        {formError && <p className="text-destructive text-xs mt-2">{formError}</p>}
        {success   && <p className="text-green-500 text-xs mt-2">{success}</p>}
      </div>

      {/* Invitations list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">{error}</div>
      ) : invitations.length === 0 ? (
        <p className="text-muted-foreground text-sm">No invitations yet.</p>
      ) : (
        <div className="space-y-3">
          {invitations.map(inv => (
            <div key={inv.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{inv.phoneNumber}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inv.role} · {new Date(inv.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'}`}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
