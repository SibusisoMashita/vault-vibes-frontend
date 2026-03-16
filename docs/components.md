# Components

A quick guide to the key components in Vault Vibes.

---

## Layout

| Component | What it does |
|-----------|-------------|
| `DashboardLayout` | Main shell — renders sidebar + outlet for page content |
| `Sidebar` | Desktop nav — links to all pages, dark mode toggle, user info |
| `Topbar` | Mobile header — group name, dark mode, settings shortcut |
| `MobileNav` | Bottom tab bar on mobile |

---

## Cards (shared)

| Component | Props | Used on |
|-----------|-------|---------|
| `ShareSummaryCard` | `member`, `perShareValue` | Dashboard |
| `PoolSummaryCard` | `totalBalance`, `liquidityAvailable`, `activeLoans`, `perShareValue`, `yearEnd` | Dashboard |
| `ValueCard` | `label`, `value`, `icon`, `trend` | Various |

---

## Feature components

### Dashboard
- `OwnershipCard` — shows shares owned, commitment vs paid, current value, and profit ring
- `MetricsCards` — four stat cards: share value, estimated payout, pool balance, members
- `RecentActivity` — latest transactions with type icons and amounts

### Pool
- `ContributionModal` — upload proof of payment, preview totals including any outstanding loan repayment

### Loans
- `LoanRequestModal` — enter amount, see interest preview, submit request

### Notifications
- `NotificationBell` — badge with unread count (gated behind `FEATURE_FLAGS.NOTIFICATIONS`)

---

## Admin pages

| Page | Purpose |
|------|---------|
| `AdminPage` | Overview: alerts, contribution rates, pending loan approvals |
| `AdminLoansPage` | Full loan list with approve / reject / repay actions |
| `AdminContributionsPage` | Verify or reject proof-of-payment submissions |
| `AdminMembersPage` | Invite members, edit roles/shares, suspend accounts |
| `AdminStokvelConfigPage` | Set total shares and share price |
| `AdminBorrowingConfigPage` | Set the loan interest rate |
| `AdminBankInterestPage` | Record bank interest earned on the group account |
| `AdminRolesPage` | Read-only view of role definitions and permissions |

---

## Auth components

| Component | What it does |
|-----------|-------------|
| `AuthProvider` | Wraps app — manages Cognito token lifecycle |
| `AuthGuard` | Redirects to `/login` if no valid token |
| `AdminGuard` | Redirects non-admins to `/dashboard` |

---

## Hooks

| Hook | Returns |
|------|---------|
| `useDashboardData` | `pool`, `shares`, `group`, `summary`, `loading`, `refetch` |
| `usePoolStats` | `pool`, `shares`, `loading` |
| `usePoolProjection` | `projection`, `loading` |
| `useMembers` | `members`, `loading` |
| `useLoans` | `loans`, `loading`, `refetch` |
| `useLedger` | `transactions`, `loading`, `refetch` |
| `useContributions` | `contributions`, `loading`, `refetch` |
| `useAuth` | `currentUser`, `isAuthenticated`, `role` |

---

## Services

| Service | API endpoints |
|---------|--------------|
| `DashboardService` | `GET /dashboard/summary` |
| `PoolService` | `GET /pool/stats`, `GET /pool/projection` |
| `LoansService` | `GET/POST /loans`, approve/reject/repay |
| `ContributionsService` | `GET/POST /contributions`, verify/reject |
| `LedgerService` | `GET /ledger` |
| `UsersService` | `GET /users/me`, list/update members |
| `InvitationsService` | `GET/POST /invitations`, resend/delete |
| `SharesService` | `GET /shares`, update user shares |
| `ConfigService` | `GET/PUT /config/stokvel`, `/config/borrowing` |
