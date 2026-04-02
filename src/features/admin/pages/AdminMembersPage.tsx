import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, Edit2, RefreshCw, Trash2, Loader2, Send, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { UsersService } from '../../../services/usersService';
import { InvitationsService, Invitation } from '../../../services/invitationsService';
import { Member } from '../../../types';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { isGroupAdmin } from '../../../auth/permissions';
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

export function AdminMembersPage() {
  const { currentUser } = useApp();
  useSetPageHeader('Members & Invitations', 'Manage members and send invitations');

  const [members, setMembers]         = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);

  // Invitation action confirmation dialog state
  const [invitationAction, setInvitationAction] = useState<{
    type: InvitationActionType;
    invitation: Invitation;
  } | null>(null);
  const [invitationActionLoading, setInvitationActionLoading] = useState<Record<string, InvitationActionType | null>>({});

  const nameRef   = useRef<HTMLInputElement>(null);
  const phoneRef  = useRef<HTMLInputElement>(null);
  const sharesRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState('MEMBER');

  // Per-member invite loading state
  const [invitingMemberId, setInvitingMemberId] = useState<string | null>(null);

  // Per-member status toggle loading state
  const [togglingMemberId, setTogglingMemberId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([UsersService.listMembers(), InvitationsService.list()])
      .then(([m, inv]) => {
        if (!cancelled) { setMembers(m); setInvitations(inv); }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── Invite form ──────────────────────────────────────────────────────────────
  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    const name   = nameRef.current?.value.trim() ?? '';
    const phone  = phoneRef.current?.value.trim() ?? '';
    const shares = parseInt(sharesRef.current?.value ?? '0', 10);
    if (!name)              { setFormError('Full name is required'); return; }
    if (!phone)             { setFormError('Phone number is required'); return; }
    if (!shares || shares < 1) { setFormError('Share units must be at least 1'); return; }
    setSubmitting(true);
    try {
      const [inv, updatedMembers] = await Promise.all([
        InvitationsService.create(name, phone, role, shares),
        UsersService.listMembers(),
      ]);
      setInvitations(prev => [inv, ...prev]);
      setMembers(updatedMembers);
      setSuccess(`Invitation sent to ${name}`);
      if (nameRef.current)   nameRef.current.value = '';
      if (phoneRef.current)  phoneRef.current.value = '';
      if (sharesRef.current) sharesRef.current.value = '';
      setRole('MEMBER');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create invitation');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Member actions ───────────────────────────────────────────────────────────
  async function handleToggleStatus(member: Member) {
    if (togglingMemberId) return;
    const newStatus = member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTogglingMemberId(member.id);
    try {
      await UsersService.updateStatus(member.id, newStatus);
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : `Failed to ${newStatus === 'ACTIVE' ? 'activate' : 'suspend'} member`);
    } finally {
      setTogglingMemberId(null);
    }
  }

  // ── Invitation actions ───────────────────────────────────────────────────────
  function openInvitationAction(type: InvitationActionType, invitation: Invitation) {
    setInvitationAction({ type, invitation });
  }

  function closeInvitationAction() {
    if (invitationAction && invitationActionLoading[invitationAction.invitation.id] === invitationAction.type) return;
    setInvitationAction(null);
  }

  async function handleConfirmInvitationAction() {
    if (!invitationAction) return;
    const { type, invitation } = invitationAction;
    setInvitationActionLoading(prev => ({ ...prev, [invitation.id]: type }));
    try {
      if (type === 'resend') {
        await InvitationsService.resend(invitation.id);
        toast.success(`Invitation resent to ${invitation.userFullName}`);
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

  // Returns the active (PENDING or SENT) invitation for a member, if any
  function getActiveInvitation(memberId: string): Invitation | undefined {
    return invitations.find(
      inv => inv.userId === memberId && (inv.status === 'PENDING' || inv.status === 'SENT'),
    );
  }

  // Invite an existing PENDING member who hasn't been invited yet.
  // Backend detects the existing user by phone and creates a fresh invitation
  // without re-allocating their shares.
  async function handleInviteMember(member: Member) {
    setInvitingMemberId(member.id);
    try {
      const shareUnits = Math.max(1, Math.round(member.sharesOwned));
      const inv = await InvitationsService.create(
        member.name, member.phoneNumber, member.role.toUpperCase(), shareUnits,
      );
      setInvitations(prev => [...prev.filter(i => i.userId !== member.id), inv]);
      toast.success(`Invitation sent to ${member.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInvitingMemberId(null);
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Invite form ─────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-base font-semibold mb-4">Invite a new member</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              ref={nameRef}
              type="text"
              placeholder="Full name"
              className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              ref={phoneRef}
              type="tel"
              placeholder="+27720000000"
              className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input
              ref={sharesRef}
              type="number"
              min="1"
              placeholder="Share units"
              className="px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Sending…' : 'Send Invitation'}
          </button>
        </form>
        {formError && <p className="text-destructive text-xs mt-2">{formError}</p>}
        {success   && <p className="text-green-500 text-xs mt-2">{success}</p>}
      </div>

      {/* ── Invitations table (direct rows — no phone matching needed) ────────── */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-5 border-b border-border flex items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">Pending Invitations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">People who have been invited but haven't joined yet</p>
          </div>
          {!loading && invitations.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-500 tabular-nums">
              {invitations.filter(i => i.status === 'PENDING' || i.status === 'SENT').length} active
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-secondary rounded-xl" />)}
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No invitations sent yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {invitations.map(inv => {
              const busy = Boolean(invitationActionLoading[inv.id]);
              return (
                <div key={inv.id} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-yellow-400/10 flex items-center justify-center text-sm font-bold text-yellow-500 shrink-0">
                    {inv.userFullName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{inv.userFullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {inv.userPhoneNumber} · {inv.userRole} · invited {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 hidden sm:inline ${STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {inv.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openInvitationAction('resend', inv)}
                      disabled={busy || (inv.status !== 'PENDING' && inv.status !== 'SENT')}
                      title={inv.status === 'PENDING' || inv.status === 'SENT' ? 'Resend invitation SMS' : 'Only PENDING or SENT invitations can be resent'}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {invitationActionLoading[inv.id] === 'resend'
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="h-3.5 w-3.5" />}
                      <span>Resend</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openInvitationAction('delete', inv)}
                      disabled={busy}
                      title="Delete invitation"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {invitationActionLoading[inv.id] === 'delete'
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Members table (all members — PENDING, ACTIVE, SUSPENDED) ─────────── */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-5 border-b border-border flex items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">Members</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All members of the collective</p>
          </div>
          {!loading && members.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent tabular-nums">
              {members.length} total
            </span>
          )}
        </div>
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-secondary rounded-xl" />)}
          </div>
        ) : members.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {members.map(member => {
              const activeInv    = getActiveInvitation(member.id);
              const isPending    = member.status === 'PENDING';
              const isInviting   = invitingMemberId === member.id;
              return (
                <div key={member.id} className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                  {/* Avatar — yellow for uninvited PENDING, accent for everyone else */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isPending ? 'bg-yellow-400/10 text-yellow-500' : 'bg-accent/20 text-accent'
                  }`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.phoneNumber}</p>
                  </div>

                  <p className="text-xs text-muted-foreground hidden lg:block w-16 text-right tabular-nums">
                    {member.sharesOwned} shares
                  </p>

                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize hidden sm:inline">
                    {member.role}
                  </span>

                  {/* Status badge */}
                  {isPending ? (
                    activeInv ? (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 hidden md:inline ${STATUS_COLORS[activeInv.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {activeInv.status}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 hidden md:inline bg-muted text-muted-foreground">
                        Not invited
                      </span>
                    )
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-full hidden md:inline ${
                      member.status === 'ACTIVE'
                        ? 'bg-green-400/10 text-green-500'
                        : 'bg-red-400/10 text-red-500'
                    }`}>
                      {member.status}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/admin/members/${member.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                      title="Edit member"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>

                    {isPending && !activeInv && (
                      <button
                        type="button"
                        onClick={() => handleInviteMember(member)}
                        disabled={isInviting}
                        title="Send invitation SMS"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isInviting
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <UserPlus className="h-3.5 w-3.5" />}
                        <span>{isInviting ? 'Sending…' : 'Invite'}</span>
                      </button>
                    )}

                    {!isPending && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(member)}
                          disabled={togglingMemberId === member.id}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            member.status === 'ACTIVE'
                              ? 'text-red-500 hover:bg-red-400/10'
                              : 'text-green-500 hover:bg-green-400/10'
                          }`}
                          title={member.status === 'ACTIVE' ? 'Suspend member' : 'Activate member'}
                        >
                          {togglingMemberId === member.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : member.status === 'ACTIVE'
                              ? <XCircle className="w-4 h-4" />
                              : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Invitation confirmation dialog ───────────────────────────────────── */}
      <AlertDialog open={Boolean(invitationAction)} onOpenChange={open => { if (!open) closeInvitationAction(); }}>
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
                <AlertDialogHeader className="gap-1 text-left">
                  <AlertDialogTitle className="text-base">
                    {invitationAction.type === 'delete' ? 'Delete invitation?' : 'Resend invitation?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="leading-6">
                    {invitationAction.type === 'delete'
                      ? `This will permanently remove the invitation for ${invitationAction.invitation.userFullName}. This cannot be undone.`
                      : `This will send a new temporary password to ${invitationAction.invitation.userFullName} (${invitationAction.invitation.userPhoneNumber}) via WinSMS.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>

              <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm">
                <span className="font-medium">{invitationAction.invitation.userFullName}</span>
                <span className="text-muted-foreground">
                  {' · '}{invitationAction.invitation.userPhoneNumber}
                  {' · '}{invitationAction.invitation.userRole}
                  {' · '}<span className={`font-medium ${STATUS_COLORS[invitationAction.invitation.status] ?? ''}`}>{invitationAction.invitation.status}</span>
                </span>
              </div>

              <AlertDialogFooter className="gap-2 sm:justify-end">
                <AlertDialogCancel disabled={invitationActionBusy} className="rounded-xl">
                  Cancel
                </AlertDialogCancel>
                <button
                  type="button"
                  onClick={handleConfirmInvitationAction}
                  disabled={invitationActionBusy}
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
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
