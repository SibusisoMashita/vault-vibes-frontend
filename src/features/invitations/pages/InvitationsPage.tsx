import { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvitationsService, Invitation } from '../../../services/invitationsService';
import { useApp } from '../../../app/providers';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { hasPermission, Permission } from '../../../auth/permissions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';

const ROLES = ['MEMBER', 'TREASURER', 'CHAIRPERSON', 'ADMIN'];

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-yellow-400/10 text-yellow-500',
  SENT:      'bg-blue-400/10 text-blue-500',
  ACCEPTED:  'bg-green-400/10 text-green-500',
  EXPIRED:   'bg-red-400/10 text-red-500',
  CANCELLED: 'bg-muted text-muted-foreground',
};

type InvitationActionType = 'resend' | 'delete';

function canResend(invitation: Invitation) {
  return invitation.status === 'PENDING' || invitation.status === 'SENT';
}

export function InvitationsPage() {
  const { currentUser } = useApp();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const [invitationAction, setInvitationAction] = useState<{
    type: InvitationActionType;
    invitation: Invitation;
  } | null>(null);
  const [invitationActionLoading, setInvitationActionLoading] = useState<Record<string, InvitationActionType | null>>({});
  const nameRef  = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
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
    const name  = nameRef.current?.value.trim() ?? '';
    const phone = phoneRef.current?.value.trim() ?? '';
    if (!name)  { setFormError('Full name is required'); return; }
    if (!phone) { setFormError('Phone number is required'); return; }

    setSubmitting(true);
    try {
      const inv = await InvitationsService.create(name, phone, role);
      setInvitations(prev => [inv, ...prev]);
      setSuccess(`Invitation sent to ${phone}`);
      if (nameRef.current)  nameRef.current.value = '';
      if (phoneRef.current) phoneRef.current.value = '';
      setRole('MEMBER');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create invitation');
    } finally {
      setSubmitting(false);
    }
  }

  function openInvitationAction(type: InvitationActionType, invitation: Invitation) {
    setInvitationAction({ type, invitation });
  }

  function closeInvitationAction() {
    if (
      invitationAction &&
      invitationActionLoading[invitationAction.invitation.id] === invitationAction.type
    ) {
      return;
    }
    setInvitationAction(null);
  }

  async function handleConfirmInvitationAction() {
    if (!invitationAction) return;

    const { type, invitation } = invitationAction;
    setInvitationActionLoading(prev => ({ ...prev, [invitation.id]: type }));

    try {
      if (type === 'resend') {
        const updatedInvitation = await InvitationsService.resend(invitation.id);
        setInvitations(prev => prev.map(inv => inv.id === updatedInvitation.id ? updatedInvitation : inv));
        toast.success(`Invitation resent to ${updatedInvitation.userPhoneNumber}`);
      } else {
        await InvitationsService.remove(invitation.id);
        setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
        toast.success(`Invitation deleted for ${invitation.userFullName}`);
      }

      setInvitationAction(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : `Failed to ${type} invitation`);
    } finally {
      setInvitationActionLoading(prev => ({ ...prev, [invitation.id]: null }));
    }
  }

  const invitationActionBusy = invitationAction
    ? invitationActionLoading[invitationAction.invitation.id] === invitationAction.type
    : false;

  return (
    <div className="max-w-3xl">
      {/* Create form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-base font-semibold mb-4">Invite a new member</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={nameRef}
              type="text"
              placeholder="Full name"
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
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
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="self-start px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition-all"
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
            <div key={inv.id} className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-sm">{inv.userFullName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inv.userPhoneNumber} · {inv.userRole} · {new Date(inv.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {inv.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openInvitationAction('resend', inv)}
                    disabled={Boolean(invitationActionLoading[inv.id]) || !canResend(inv)}
                    title={canResend(inv) ? 'Resend invitation' : 'Only pending or sent invitations can be resent'}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {invitationActionLoading[inv.id] === 'resend'
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <RefreshCw className="h-3.5 w-3.5" />}
                    Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => openInvitationAction('delete', inv)}
                    disabled={Boolean(invitationActionLoading[inv.id])}
                    className="inline-flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {invitationActionLoading[inv.id] === 'delete'
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(invitationAction)} onOpenChange={(open) => { if (!open) closeInvitationAction(); }}>
        <AlertDialogContent className="max-w-md rounded-2xl border-border bg-card p-0 shadow-2xl">
          {invitationAction && (
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  invitationAction.type === 'delete'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-accent/10 text-accent'
                }`}>
                  {invitationAction.type === 'delete'
                    ? <Trash2 className="h-5 w-5" />
                    : <RefreshCw className="h-5 w-5" />}
                </div>
                <AlertDialogHeader className="gap-2 text-left">
                  <AlertDialogTitle className="text-base">
                    {invitationAction.type === 'delete' ? 'Delete invitation?' : 'Resend invitation?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="leading-6">
                    {invitationAction.type === 'delete'
                      ? `This will permanently remove the invitation for ${invitationAction.invitation.userFullName}. This action cannot be undone.`
                      : `This will resend the invitation SMS to ${invitationAction.invitation.userFullName} (${invitationAction.invitation.userPhoneNumber}). A new temporary password will be generated.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>

              <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{invitationAction.invitation.userRole}</span>
                {' · '}
                <span>{invitationAction.invitation.status}</span>
              </div>

              <AlertDialogFooter className="sm:justify-between">
                <AlertDialogCancel
                  disabled={invitationActionBusy}
                  className="rounded-xl border-border"
                >
                  Cancel
                </AlertDialogCancel>
                <button
                  type="button"
                  onClick={handleConfirmInvitationAction}
                  disabled={invitationActionBusy}
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    invitationAction.type === 'delete'
                      ? 'bg-destructive hover:bg-destructive/90'
                      : 'bg-accent hover:bg-accent/90'
                  }`}
                >
                  {invitationActionBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {invitationAction.type === 'delete'
                    ? (invitationActionBusy ? 'Deleting…' : 'Delete invitation')
                    : (invitationActionBusy ? 'Resending…' : 'Resend invitation')}
                </button>
              </AlertDialogFooter>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
