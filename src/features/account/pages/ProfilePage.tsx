import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UsersService } from '../../../services/usersService';
import { Member } from '../../../types';
import { formatCurrency, getProgressPercentage } from '../../../utils/currency';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { usePoolProjection } from '../../../hooks/usePoolProjection';
import { useApp } from '../../../app/context/AppContext';

export function ProfilePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { projection, loading: projectionLoading } = usePoolProjection();
  const { setCurrentUser } = useApp();

  useSetPageHeader('Profile');

  useEffect(() => {
    let cancelled = false;
    UsersService.getMe()
      .then(m => {
        if (!cancelled) {
          setMember(m);
          setFullName(m.name);
          setEmail(m.email);
        }
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function handleStartEdit() {
    if (!member) return;
    setFullName(member.name);
    setEmail(member.email);
    setSaveError(null);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    if (!member) return;
    setFullName(member.name);
    setEmail(member.email);
    setSaveError(null);
    setIsEditing(false);
  }

  async function handleSaveProfile() {
    if (!member) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setSaveError('Full name is required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const updatedProfile = await UsersService.updateProfile(member.id, {
        fullName: trimmedName,
        phoneNumber: member.phoneNumber,
        email: trimmedEmail,
      });
      const updatedMember = {
        ...member,
        ...updatedProfile,
      };
      setMember(updatedMember);
      setCurrentUser(updatedMember);
      setFullName(updatedMember.name);
      setEmail(updatedMember.email);
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setSaveError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">{error}</div>
      </div>
    );
  }

  if (!member) return null;

  const stats = [
    { label: 'Shares Owned', value: member.sharesOwned.toString() },
    { label: 'Total Commitment', value: formatCurrency(member.totalCommitment) },
    { label: 'Paid So Far', value: formatCurrency(member.paidSoFar) },
    { label: 'Remaining', value: formatCurrency(member.remaining) },
  ];

  const memberProjectedPayout = member.sharesOwned * (projection?.projectedPerShareValue ?? 0);
  const progressPct = getProgressPercentage(member.paidSoFar, memberProjectedPayout);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{member.name}</h2>
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize mt-1">
                {member.role}
              </span>
            </div>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-full-name" className="mb-1.5 block text-xs text-muted-foreground">
                  Full name
                </label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="mb-1.5 block text-xs text-muted-foreground">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-phone" className="mb-1.5 block text-xs text-muted-foreground">
                  Phone number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={member.phoneNumber}
                  disabled
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="profile-member-id" className="mb-1.5 block text-xs text-muted-foreground">
                  Member ID
                </label>
                <input
                  id="profile-member-id"
                  type="text"
                  value={member.id}
                  disabled
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-mono text-muted-foreground"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Phone number changes are still managed by an administrator.
            </p>

            {saveError && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {saveError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            {member.email && (
              <div className="flex justify-between gap-4">
                <span>Email</span>
                <span className="text-right text-foreground">{member.email}</span>
              </div>
            )}
            {member.phoneNumber && (
              <div className="flex justify-between gap-4">
                <span>Phone</span>
                <span className="text-right text-foreground">{member.phoneNumber}</span>
              </div>
            )}
            {member.id && (
              <div className="flex justify-between gap-4">
                <span>Member ID</span>
                <span className="font-mono text-xs text-right text-foreground">{member.id}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Contribution Progress */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Contribution Progress</h3>
          <Link to="/distributions" className="flex items-center gap-1 text-xs text-accent hover:underline">
            View projected payout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {projectionLoading ? (
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-secondary animate-pulse" />
            <div className="h-3 w-32 rounded bg-secondary animate-pulse" />
          </div>
        ) : memberProjectedPayout === 0 ? (
          <p className="text-sm text-muted-foreground">Projection not yet available.</p>
        ) : (
          <>
            <div
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Contribution progress: ${progressPct}% of projected December payout`}
              className="relative h-3 bg-secondary rounded-full overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{formatCurrency(member.paidSoFar)} contributed</span>
              <span className="font-bold tabular-nums text-accent">{progressPct}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(memberProjectedPayout)} projected December value
            </p>
          </>
        )}
      </div>
    </div>
  );
}
