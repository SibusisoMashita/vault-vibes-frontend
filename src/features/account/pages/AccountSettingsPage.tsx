import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/providers';

export function AccountSettingsPage() {
  const { currentUser } = useApp();

  useSetPageHeader('Account Settings');

  return (
    <div className="max-w-2xl space-y-6">
      {/* Password */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Password</h2>
        <p className="text-sm text-muted-foreground">
          Password management is handled through your authentication provider.
        </p>
      </div>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Preferences</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Display Name</span>
          <span className="font-medium">{currentUser.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium capitalize">{currentUser.role}</span>
        </div>
      </div>

      {/* Security & Sessions */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Security &amp; Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Active session management and device controls will be available in a future update.
        </p>
      </div>
    </div>
  );
}
