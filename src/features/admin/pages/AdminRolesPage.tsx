import { Shield, Crown, Wallet, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { isGroupAdmin } from '../../../auth/permissions';

const MEMBER_PERMISSIONS = [
  'View group pool statistics and balances',
  'View the transaction ledger',
  'Make contributions to the stokvel',
  'Submit borrowing requests (subject to approval)',
];

const GROUP_ADMIN_PERMISSIONS = [
  'View group pool statistics and balances',
  'View the transaction ledger',
  'Make contributions to the stokvel',
  'Submit borrowing requests (subject to approval)',
  'Verify and approve member contribution payments',
  'Approve or reject borrowing requests',
  'Record loan repayments',
  'Record bank interest income to the pool',
  'Invite new members to the stokvel',
  'Manage shares and stokvel configuration',
  'View financial reports and analytics',
  'Access and audit the transaction ledger',
];

const ROLE_DEFINITIONS = [
  {
    key:         'ADMIN',
    name:        'Admin',
    badge:       null,
    icon:        Shield,
    color:       'bg-accent/10 text-accent',
    description: 'Full system access. Manages the stokvel at every level including advanced configuration and member governance.',
    permissions: [
      ...GROUP_ADMIN_PERMISSIONS,
      'System administration and advanced settings',
    ],
  },
  {
    key:         'CHAIRPERSON',
    name:        'Chairperson',
    badge:       'Group Administrator',
    icon:        Crown,
    color:       'bg-violet-400/10 text-violet-400',
    description: 'Leads group governance. Oversees member management, borrowing decisions, and financial oversight.',
    permissions: GROUP_ADMIN_PERMISSIONS,
  },
  {
    key:         'TREASURER',
    name:        'Treasurer',
    badge:       'Group Administrator',
    icon:        Wallet,
    color:       'bg-warning/10 text-warning',
    description: 'Manages the financial operations of the stokvel. Records contributions, approves loans, and maintains the ledger.',
    permissions: GROUP_ADMIN_PERMISSIONS,
  },
  {
    key:         'MEMBER',
    name:        'Member',
    badge:       null,
    icon:        Users,
    color:       'bg-chart-3/10 text-chart-3',
    description: 'Standard stokvel member. Can contribute, request borrowings, and track their own financial position.',
    permissions: MEMBER_PERMISSIONS,
  },
];

export function AdminRolesPage() {
  const { currentUser } = useApp();
  useSetPageHeader('Roles', 'Role definitions and access levels');

  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
      >
        {ROLE_DEFINITIONS.map(({ key, name, badge, icon: Icon, color, description, permissions }) => (
          <div key={key} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{name}</h3>
                  {badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{key.toLowerCase()}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

            {/* Permissions */}
            <ul className="space-y-2 flex-1">
              {permissions.map(perm => (
                <li key={perm} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-sm text-muted-foreground">
        Role assignments are managed on the Members page. Changes take effect immediately upon next login.
      </div>
    </div>
  );
}
