import { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { UsersService } from '../../../services/usersService';
import { InvitationsService, Invitation } from '../../../services/invitationsService';
import { Member } from '../../../types';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

const ROLES = ['MEMBER', 'TREASURER', 'CHAIRPERSON', 'ADMIN'];

const STATUS_COLORS: Record<string, string> = {
  PENDING:  'bg-yellow-400/10 text-yellow-500',
  ACCEPTED: 'bg-green-400/10 text-green-500',
  EXPIRED:  'bg-red-400/10 text-red-500',
};

export function AdminMembersPage() {
  useSetPageHeader('Members & Invitations', 'Manage members and send invitations');

  const [members, setMembers]         = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);

  const phoneRef      = useRef<HTMLInputElement>(null);
  const shareUnitsRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState('MEMBER');

  // Edit modal state
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editRole, setEditRole]     = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([UsersService.listMembers(), InvitationsService.list()])
      .then(([m, inv]) => {
        if (!cancelled) { setMembers(m); setInvitations(inv); }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const phone      = phoneRef.current?.value.trim() ?? '';
    const shareUnits = parseFloat(shareUnitsRef.current?.value ?? '0');

    if (!phone) { setFormError('Phone number is required'); return; }
    if (!shareUnits || shareUnits <= 0) {
      setFormError('A member must be assigned at least part of a share.');
      return;
    }

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

  async function handleToggleStatus(member: Member) {
    const newStatus = member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await UsersService.updateStatus(member.id, newStatus);
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
    } catch { /* ignore */ }
  }

  async function handleSaveRole() {
    if (!editMember) return;
    setEditSaving(true);
    try {
      await UsersService.updateRole(editMember.id, editRole);
      setMembers(prev => prev.map(m =>
        m.id === editMember.id ? { ...m, role: editRole.toLowerCase() as Member['role'] } : m
      ));
      setEditMember(null);
    } catch { /* ignore */ } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Invite Member */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-base font-semibold mb-4">Invite a new member</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <div>
              <input
                ref={shareUnitsRef}
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Shares (e.g. 1.5)"
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              How many shares should this member receive? You can assign fractional shares (e.g. 1.5).
              A member must receive at least part of a share. These shares will be reserved when they join.
            </p>
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

      {/* Members Table */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold">Members</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-secondary rounded-xl" />)}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {members.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">No members found.</p>
            )}
            {members.map(member => (
              <div key={member.id} className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
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
                <span className={`text-xs px-2 py-1 rounded-full hidden md:inline ${
                  member.status === 'ACTIVE'
                    ? 'bg-green-400/10 text-green-500'
                    : 'bg-red-400/10 text-red-500'
                }`}>
                  {member.status}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditMember(member); setEditRole(member.role.toUpperCase()); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    title="Edit role"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(member)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      member.status === 'ACTIVE'
                        ? 'text-red-500 hover:bg-red-400/10'
                        : 'text-green-500 hover:bg-green-400/10'
                    }`}
                    title={member.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  >
                    {member.status === 'ACTIVE'
                      ? <XCircle className="w-4 h-4" />
                      : <CheckCircle className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitations Table */}
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold">Invitations</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1,2].map(i => <div key={i} className="h-10 bg-secondary rounded-xl" />)}
          </div>
        ) : invitations.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No invitations yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {invitations.map(inv => (
              <div key={inv.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{inv.phoneNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inv.role} · {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
                    {inv.shareUnits} shares
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="font-semibold">Edit Role — {editMember.name}</h3>
            <select
              value={editRole}
              onChange={e => setEditRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setEditMember(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={editSaving}
                className="flex-1 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {editSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
