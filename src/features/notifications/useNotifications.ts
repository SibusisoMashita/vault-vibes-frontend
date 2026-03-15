import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../../app/providers';
import { LoansService } from '../../services/loansService';
import { DistributionsService } from '../../services/distributionsService';
import { ContributionsService } from '../../services/contributionsService';
import { AppNotification, buildMessage, buildTitle } from './notificationTypes';

const LS_KEY = 'vv_read_notifications';

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
}

function deriveNotifications(
  userId: string,
  loans: Awaited<ReturnType<typeof LoansService.list>>,
  distributions: Awaited<ReturnType<typeof DistributionsService.list>>,
  contributions: Awaited<ReturnType<typeof ContributionsService.list>>,
): AppNotification[] {
  const items: AppNotification[] = [];

  // --- Loan notifications for current user ---
  for (const loan of loans) {
    if (loan.memberId !== userId) continue;

    if (loan.status === 'active' || loan.status === 'repaid') {
      items.push({
        id: `LOAN_APPROVED:${loan.id}`,
        type: 'LOAN_APPROVED',
        title: buildTitle('LOAN_APPROVED'),
        message: buildMessage('LOAN_APPROVED', { amount: loan.amount }),
        timestamp: loan.dateIssued,
        link: '/loans',
      });
      items.push({
        id: `LOAN_ISSUED:${loan.id}`,
        type: 'LOAN_ISSUED',
        title: buildTitle('LOAN_ISSUED'),
        message: buildMessage('LOAN_ISSUED', { amount: loan.amount }),
        timestamp: loan.dateIssued,
        link: '/loans',
      });
    }
  }

  // --- Distribution notifications for current user ---
  for (const dist of distributions) {
    if (dist.userId !== userId) continue;
    items.push({
      id: `DISTRIBUTION_EXECUTED:${dist.id}`,
      type: 'DISTRIBUTION_EXECUTED',
      title: buildTitle('DISTRIBUTION_EXECUTED'),
      message: buildMessage('DISTRIBUTION_EXECUTED', { amount: dist.amount }),
      timestamp: dist.distributedAt,
      link: '/distributions',
    });
  }

  // --- Contribution overdue: no contribution recorded for the current month ---
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hasContributedThisMonth = contributions.some(
    (c) => c.memberId === userId && c.date?.startsWith(currentYM),
  );
  if (!hasContributedThisMonth) {
    const overdueId = `CONTRIBUTION_OVERDUE:${userId}:${currentYM}`;
    items.push({
      id: overdueId,
      type: 'CONTRIBUTION_OVERDUE',
      title: buildTitle('CONTRIBUTION_OVERDUE'),
      message: buildMessage('CONTRIBUTION_OVERDUE', {}),
      timestamp: `${currentYM}-01T00:00:00Z`,
      link: '/pool',
    });
  }

  // Sort: most recent first
  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return items;
}

export function useNotifications() {
  const { currentUser } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    let cancelled = false;

    async function load() {
      try {
        const [loans, distributions, contributions] = await Promise.all([
          LoansService.list(),
          DistributionsService.list(),
          ContributionsService.list(),
        ]);
        if (cancelled) return;
        setNotifications(
          deriveNotifications(currentUser.id, loans, distributions, contributions),
        );
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [currentUser?.id]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return { notifications, readIds, unreadCount, loading, markRead, markAllRead };
}
