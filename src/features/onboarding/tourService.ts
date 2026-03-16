import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function startTour(): void {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayOpacity: 0.6,
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Done',
    steps: [
      {
        popover: {
          title: 'Welcome to Vault Vibes',
          description: 'This is your stokvel dashboard. Let us show you around in a few quick steps.',
          side: 'over' as const,
          align: 'center',
        },
      },
      {
        element: '[data-tour="shares-card"]',
        popover: {
          title: 'Your Shares',
          description: 'Shares represent your stake in the group fund. The more shares you hold, the larger your year-end payout.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '[data-tour="pool-card"]',
        popover: {
          title: 'The Group Pool',
          description: 'The pool is the total pot — made up of member contributions, bank interest, and loan repayments. Its value is divided equally among all shares.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '[data-tour="contribute-btn"]',
        popover: {
          title: 'Make a Contribution',
          description: 'Upload proof of payment each month. A treasurer will verify it and credit the pool on your behalf.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '[data-tour="borrow-btn"]',
        popover: {
          title: 'Borrow from the Group',
          description: 'Need funds? Request a loan from the pool. Repayments — including interest — flow back in and increase every member\'s share value.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '[data-tour="nav-ledger"]',
        popover: {
          title: 'Transaction History',
          description: 'Every contribution, loan, and interest entry is recorded in the Ledger. Full transparency for all members.',
          side: 'right',
          align: 'start',
        },
      },
    ],
  });

  driverObj.drive();
}
