export type NotificationType =
  | 'LOAN_APPROVED'
  | 'LOAN_ISSUED'
  | 'CONTRIBUTION_OVERDUE'
  | 'DISTRIBUTION_EXECUTED'
  | 'MEMBER_INVITED'
  | 'ROLE_UPDATED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;   // ISO string
  link?: string;
}

export function buildTitle(type: NotificationType): string {
  switch (type) {
    case 'LOAN_APPROVED':        return 'Loan Approved';
    case 'LOAN_ISSUED':          return 'Funds Disbursed';
    case 'CONTRIBUTION_OVERDUE': return 'Contribution Overdue';
    case 'DISTRIBUTION_EXECUTED': return 'Payout Received';
    case 'MEMBER_INVITED':       return 'New Member Invited';
    case 'ROLE_UPDATED':         return 'Role Updated';
  }
}

export function buildMessage(
  type: NotificationType,
  opts: { memberName?: string; amount?: number; role?: string },
): string {
  const fmt = (n: number) =>
    `R\u00a0${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  switch (type) {
    case 'LOAN_APPROVED':
      return opts.amount
        ? `Your loan of ${fmt(opts.amount)} has been approved.`
        : 'Your loan has been approved.';
    case 'LOAN_ISSUED':
      return opts.amount
        ? `${fmt(opts.amount)} has been transferred to your account.`
        : 'Your loan funds have been transferred.';
    case 'CONTRIBUTION_OVERDUE':
      return opts.amount
        ? `Your monthly contribution of ${fmt(opts.amount)} is overdue. Please pay as soon as possible.`
        : 'Your monthly contribution is overdue.';
    case 'DISTRIBUTION_EXECUTED':
      return opts.amount
        ? `Your year-end payout of ${fmt(opts.amount)} has been distributed.`
        : 'Your year-end payout has been distributed.';
    case 'MEMBER_INVITED':
      return opts.memberName
        ? `${opts.memberName} has been invited to join the stokvel.`
        : 'A new member has been invited to join the stokvel.';
    case 'ROLE_UPDATED':
      return opts.role
        ? `Your role has been updated to ${opts.role}.`
        : 'Your stokvel role has been updated.';
  }
}
