/**
 * Centralised permission system for Vault Vibes.
 *
 * Roles (stored in users.role):
 *   MEMBER      — normal group member
 *   TREASURER   — group administrator (finances)
 *   CHAIRPERSON — group administrator (governance)
 *   ADMIN       — reserved for future system-level administration
 *
 * To check a permission:
 *   hasPermission(currentUser.role, Permission.ISSUE_LOAN)
 *
 * To check whether a user can access admin UI:
 *   isGroupAdmin(currentUser.role)
 */

// ---------------------------------------------------------------------------
// Permission constants
// ---------------------------------------------------------------------------

export const Permission = {
  // ── Member-level ──────────────────────────────────────────────────────────
  VIEW_POOL:              'VIEW_POOL',
  VIEW_LEDGER:            'VIEW_LEDGER',
  CONTRIBUTE:             'CONTRIBUTE',
  REQUEST_LOAN:           'REQUEST_LOAN',

  // ── Group administrator (Treasurer / Chairperson) ────────────────────────
  VERIFY_CONTRIBUTION:    'VERIFY_CONTRIBUTION',
  ISSUE_LOAN:             'ISSUE_LOAN',
  RECORD_REPAYMENT:       'RECORD_REPAYMENT',
  RECORD_BANK_INTEREST:   'RECORD_BANK_INTEREST',
  INVITE_MEMBER:          'INVITE_MEMBER',
  MANAGE_SHARES:          'MANAGE_SHARES',
  VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
  AUDIT_LEDGER:           'AUDIT_LEDGER',

  // ── Platform administration ───────────────────────────────────────────────
  MANAGE_STOKVELS:        'MANAGE_STOKVELS',
  SYSTEM_ADMIN:           'SYSTEM_ADMIN',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

// ---------------------------------------------------------------------------
// Role → permission mapping
// ---------------------------------------------------------------------------

const MEMBER_PERMISSIONS: readonly Permission[] = [
  Permission.VIEW_POOL,
  Permission.VIEW_LEDGER,
  Permission.CONTRIBUTE,
  Permission.REQUEST_LOAN,
];

const GROUP_ADMIN_PERMISSIONS: readonly Permission[] = [
  ...MEMBER_PERMISSIONS,
  Permission.VERIFY_CONTRIBUTION,
  Permission.ISSUE_LOAN,
  Permission.RECORD_REPAYMENT,
  Permission.RECORD_BANK_INTEREST,
  Permission.INVITE_MEMBER,
  Permission.MANAGE_SHARES,
  Permission.VIEW_FINANCIAL_REPORTS,
  Permission.AUDIT_LEDGER,
];

const ALL_PERMISSIONS: readonly Permission[] = [
  ...GROUP_ADMIN_PERMISSIONS,
  Permission.MANAGE_STOKVELS,
  Permission.SYSTEM_ADMIN,
];

/**
 * Single source of truth for which permissions each role holds.
 * Keyed by uppercase role name to match the DB/API value.
 */
export const ROLE_PERMISSIONS: Readonly<Record<string, readonly Permission[]>> = {
  MEMBER:      MEMBER_PERMISSIONS,
  TREASURER:   GROUP_ADMIN_PERMISSIONS,
  CHAIRPERSON: GROUP_ADMIN_PERMISSIONS,
  ADMIN:       ALL_PERMISSIONS,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given role has the requested permission.
 * Role comparison is case-insensitive to handle both "treasurer" and "TREASURER".
 * ADMIN implicitly passes all checks.
 */
export function hasPermission(role: string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const r = role.toUpperCase();
  if (r === 'ADMIN') return true;
  return (ROLE_PERMISSIONS[r] ?? []).includes(permission);
}

/**
 * Returns true for roles that act as group administrators.
 * Use this to gate UI sections such as the Settings sidebar.
 */
export function isGroupAdmin(role: string | undefined | null): boolean {
  if (!role) return false;
  const r = role.toUpperCase();
  return r === 'TREASURER' || r === 'CHAIRPERSON' || r === 'ADMIN';
}
