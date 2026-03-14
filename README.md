# Vault Vibes

> A modern frontend dashboard for managing a pooled savings and investment group with shares, contributions, loans, liquidity, and distribution visibility.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Feature--Based-7C3AED)](#project-architecture-overview)
[![Build Status](https://img.shields.io/badge/Build-Passing-22C55E)](#running-the-project-locally)
[![License](https://img.shields.io/badge/License-Unspecified-6B7280)](#license)

---

## Overview

**Vault Vibes** is a React + TypeScript application for visualizing and managing the operations of a pooled investment / savings group.

It gives members and administrators a clear, mobile-friendly view into:

- share ownership and commitment progress
- pool value and liquidity
- contribution history and transaction activity
- loan requests and repayment visibility
- projected year-end distributions

The app is designed as a **feature-based frontend** that keeps business areas isolated while reusing shared UI, layout, types, and utilities.

## Feature Highlights

- **Member ownership dashboard** with shares owned, commitment progress, estimated value, and recent activity
- **Shares overview** for distribution, per-share value, and member ownership ranking
- **Pool summary** with liquidity, capital received, loan exposure, and transparency indicators
- **Ledger experience** for browsing and filtering transaction history
- **Loan workflow UI** with repayment preview and request submission flow
- **Distribution tracking** with projected payouts, growth estimates, and year-end visibility
- **Responsive layout** optimized for desktop and mobile navigation
- **Feature-based architecture** for scalable frontend maintenance

## Screenshots

> Replace the placeholders below with real screenshots or animated GIFs before publishing.

| View | Preview |
|------|---------|
| Dashboard | `![Dashboard Screenshot](./docs/screenshots/dashboard-placeholder.png)` |
| Shares | `![Shares Screenshot](./docs/screenshots/shares-placeholder.png)` |
| Pool | `![Pool Screenshot](./docs/screenshots/pool-placeholder.png)` |
| Ledger | `![Ledger Screenshot](./docs/screenshots/ledger-placeholder.png)` |
| Loans | `![Loans Screenshot](./docs/screenshots/loans-placeholder.png)` |
| Distribution | `![Distribution Screenshot](./docs/screenshots/distribution-placeholder.png)` |

Suggested image paths:

```text
docs/screenshots/dashboard.png
docs/screenshots/shares.png
docs/screenshots/pool.png
docs/screenshots/ledger.png
docs/screenshots/loans.png
docs/screenshots/distribution.png
```

## Key Features

### Dashboard Overview
- Portfolio-style overview of member ownership and contribution progress
- Recent activity feed for transactions and movement across the group
- Quick actions for contributions and loan requests

### Shares Management
- Share distribution summary and capacity tracking
- Member ranking by shares owned
- Per-share value visibility

### Pool Summary
- Total balance, capital received, and liquidity visibility
- Loan composition and pool exposure insights
- Simple transparency-first financial summaries

### Ledger of Transactions
- Searchable and filterable transaction history
- Desktop detail pane and mobile timeline view
- Status and transaction type indicators

### Loan Requests
- Borrowing eligibility visibility from available liquidity
- Repayment preview and amount calculator flow
- Loan status display for active, approved, and pending items

### Distribution Tracking
- Projected payout estimates based on current pool state
- Growth view for member value vs. paid-in contributions
- Year-end countdown and payout ranking

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI/Icons | Radix UI primitives, Lucide React, Sonner |
| Motion | Motion |
| Architecture | Feature-based frontend architecture |

## Project Architecture Overview

The application follows a **feature-oriented structure**:

- `app/` composes providers, routes, and the application shell
- `features/` contains domain pages and feature-specific UI
- `components/` contains shared layout and reusable presentational components
- `services/` centralizes frontend-facing data access modules
- `utils/`, `hooks/`, and `types/` provide cross-cutting support

This separation helps the codebase scale as more workflows are added around members, contributions, loans, and distributions.

### Architecture Diagram

```text
src/main.tsx
    |
    v
src/app/App.tsx
    |
    +--> AppProviders
    |       |
    |       +--> AppContext
    |       +--> ThemeProvider
    |
    +--> DashboardLayout
            |
            +--> Sidebar / Topbar / MobileNav
            |
            +--> renderCurrentRoute(currentScreen)
                    |
                    +--> features/dashboard
                    +--> features/shares
                    +--> features/pool
                    +--> features/ledger
                    +--> features/loans
                    +--> features/distribution
                    +--> features/admin
                            |
                            +--> shared cards / shared ui / services / utils / types
```

## Folder Structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── providers.tsx
│   ├── routes.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   └── providers/
│       ├── index.ts
│       └── ThemeProvider.tsx
├── components/
│   ├── cards/
│   │   ├── PoolSummaryCard.tsx
│   │   ├── ShareSummaryCard.tsx
│   │   ├── ValueCard.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── index.ts
│   └── ui/
│       └── ...shared UI primitives
├── features/
│   ├── admin/
│   ├── dashboard/
│   ├── distribution/
│   ├── ledger/
│   ├── loans/
│   ├── pool/
│   └── shares/
├── hooks/
│   ├── index.ts
│   ├── useApi.ts
│   └── useAuth.ts
├── services/
│   ├── apiClient.ts
│   └── index.ts
├── styles/
├── types/
│   └── index.ts
└── utils/
    ├── currency.ts
    ├── date.ts
    └── index.ts
```

## Folder Structure Explained

- **`src/app`** — application bootstrap, route selection, providers, and shared app state
- **`src/features`** — domain-specific pages and feature-owned components
- **`src/components/layout`** — navigation and page shell components shared across the app
- **`src/components/cards`** — reusable summary cards used across dashboard-oriented screens
- **`src/components/ui`** — shared UI primitives and base components
- **`src/services`** — frontend data access layer (currently represented by local mock-backed exports)
- **`src/hooks`** — reusable hooks for app- and service-level access
- **`src/utils`** — formatting and helper functions
- **`src/types`** — shared domain types for members, loans, shares, transactions, pool state, and group data

## Example Dashboard API Response

The current frontend uses a local service module in `src/services/apiClient.ts`. A future backend could expose a response similar to the following shape:

```json
{
  "currentUser": {
    "id": "1",
    "name": "Sibusiso Mashita",
    "sharesOwned": 24,
    "totalCommitment": 120000,
    "paidSoFar": 96000,
    "remaining": 24000,
    "role": "member"
  },
  "group": {
    "id": "g1",
    "name": "Vault Vibes",
    "totalMembers": 12,
    "yearEnd": "2026-12-31"
  },
  "pool": {
    "totalBalance": 1248000,
    "capitalCommitted": 1200000,
    "capitalReceived": 1080000,
    "liquidityAvailable": 748000,
    "activeLoans": 3,
    "totalLoansValue": 500000,
    "perShareValue": 5778
  },
  "shares": {
    "id": "s1",
    "pricePerShare": 5000,
    "totalShares": 240,
    "sharesSold": 216,
    "sharesAvailable": 24
  },
  "transactions": [
    {
      "id": "t1",
      "memberId": "1",
      "memberName": "Sibusiso Mashita",
      "type": "contribution",
      "amount": 4000,
      "date": "2026-02-10",
      "status": "completed",
      "description": "Monthly contribution"
    }
  ]
}
```

## Installation

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

## Running the Project Locally

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Once the dev server is running, open the local URL shown in your terminal.

## Development Workflow

This repository is currently set up with the following verified scripts:

```bash
npm run dev
npm run build
```

Recommended workflow:

1. Create a feature branch
2. Make focused changes inside the appropriate feature or shared layer
3. Run a local build before opening a pull request
4. Keep UI behavior and structure consistent across desktop and mobile views

Because no dedicated lint or test scripts are currently defined in `package.json`, the safest baseline validation step is:

```bash
npm run build
```

## Future Roadmap

- [ ] Replace mock service data with a real backend API
- [ ] Add authentication and role-based access flows
- [ ] Introduce automated tests for features and utilities
- [ ] Add filtering/export workflows for reports and ledger data
- [ ] Add CI checks for builds and quality gates
- [ ] Add screenshot assets and visual documentation
- [ ] Expand admin operations for approvals, reporting, and share issuance

## Contributing

Contributions are welcome.

If you plan to contribute:

1. Fork the repository
2. Create a branch for your change
3. Keep changes scoped and readable
4. Follow the existing feature-based structure
5. Verify the project builds successfully before submitting

Example:

```bash
git checkout -b feat/improve-ledger-filters
npm install
npm run build
```

When contributing UI work, aim to preserve visual consistency and avoid mixing shared concerns with feature-specific code.

## License

This repository does **not currently declare a license file** in the verified project files.

If this project is intended for public open-source distribution, add a `LICENSE` file and update this section accordingly.

## Credits & Acknowledgements

- Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**
- Uses **Lucide React** for icons and **Sonner** for notifications
- Structured around a scalable **feature-based frontend architecture**

---

If you're using Vault Vibes as a starting point, consider adding real screenshots, a license, and CI badges to make the repository fully production-ready for public GitHub presentation.
