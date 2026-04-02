import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { UsersService } from '../../../services/usersService';
import { SharesService } from '../../../services/sharesService';
import { Member } from '../../../types';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { isGroupAdmin } from '../../../auth/permissions';

const ROLES = ['MEMBER', 'TREASURER', 'CHAIRPERSON', 'ADMIN'] as const;
const STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED'] as const;

export function AdminMemberEditPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [status, setStatus] = useState('ACTIVE');
  const [sharesOwned, setSharesOwned] = useState('0');

  useSetPageHeader('Edit Member', 'Update member profile, role, status, and shares');

  useEffect(() => {
    if (!memberId) {
      setError('Member not found.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    UsersService.getMember(memberId)
      .then((loadedMember) => {
        if (cancelled) return;
        setMember(loadedMember);
        setFullName(loadedMember.name);
        setEmail(loadedMember.email);
        setPhoneNumber(loadedMember.phoneNumber);
        setRole(loadedMember.role.toUpperCase());
        setStatus(loadedMember.status);
        setSharesOwned(String(loadedMember.sharesOwned));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load member');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [memberId]);

  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSave() {
    if (!member) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedEmail = email.trim();
    const parsedShares = Number.parseInt(sharesOwned, 10);

    if (!trimmedName) {
      setError('Full name is required.');
      return;
    }
    if (!trimmedPhone) {
      setError('Phone number is required.');
      return;
    }
    if (Number.isNaN(parsedShares) || parsedShares < 0) {
      setError('Share units must be 0 or more.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const [updatedProfile] = await Promise.all([
        UsersService.updateProfile(member.id, {
          fullName: trimmedName,
          phoneNumber: trimmedPhone,
          email: trimmedEmail,
        }),
        UsersService.updateRole(member.id, role),
        UsersService.updateStatus(member.id, status),
        SharesService.updateUserShares(member.id, parsedShares),
      ]);

      const updatedMember: Member = {
        ...member,
        ...updatedProfile,
        role: role.toLowerCase() as Member['role'],
        status: status as Member['status'],
        sharesOwned: parsedShares,
      };

      setMember(updatedMember);
      setFullName(updatedMember.name);
      setEmail(updatedMember.email);
      setPhoneNumber(updatedMember.phoneNumber);
      setRole(updatedMember.role.toUpperCase());
      setStatus(updatedMember.status);
      setSharesOwned(String(updatedMember.sharesOwned));

      if (updatedMember.id === currentUser.id) {
        setCurrentUser((prev) => ({
          ...prev,
          ...updatedMember,
        }));
      }

      toast.success(`Updated ${updatedMember.name}`);
      navigate('/admin/members');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save member';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/members"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to members
        </Link>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/members"
            className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to members
          </Link>
          <h2 className="text-2xl font-semibold text-foreground">{member.name}</h2>
          <p className="text-sm text-muted-foreground">
            Edit member details, access level, status, and share allocation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save member'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Profile Details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              These values are used for member records, invitations, and contact details.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="member-full-name" className="mb-1.5 block text-xs text-muted-foreground">
                  Full name
                </label>
                <input
                  id="member-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="member-phone" className="mb-1.5 block text-xs text-muted-foreground">
                  Phone number
                </label>
                <input
                  id="member-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="+27720000000"
                />
              </div>

              <div>
                <label htmlFor="member-email" className="mb-1.5 block text-xs text-muted-foreground">
                  Email
                </label>
                <input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Membership Setup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Control the member's permissions, account status, and number of shares.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="member-role" className="mb-1.5 block text-xs text-muted-foreground">
                  Role
                </label>
                <select
                  id="member-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {ROLES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="member-status" className="mb-1.5 block text-xs text-muted-foreground">
                  Status
                </label>
                <select
                  id="member-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {STATUSES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="member-shares" className="mb-1.5 block text-xs text-muted-foreground">
                  Share units
                </label>
                <input
                  id="member-shares"
                  type="number"
                  min="0"
                  value={sharesOwned}
                  onChange={(event) => setSharesOwned(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Member Snapshot</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Member ID</span>
                <span className="font-mono text-xs text-foreground">{member.id}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Paid so far</span>
                <span className="text-foreground">{member.paidSoFar}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Remaining</span>
                <span className="text-foreground">{member.remaining}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Total commitment</span>
                <span className="text-foreground">{member.totalCommitment}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold">Save Notes</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Changing status to `SUSPENDED` logs the member out immediately.</li>
              <li>Phone and email changes now update the backend profile data used by the app.</li>
              <li>Share updates change the member allocation used throughout the admin dashboards.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
