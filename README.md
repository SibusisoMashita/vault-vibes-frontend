# Vault Vibes

A digital stokvel platform that manages contributions, loans, and share-based pool valuation for members.

Members contribute monthly, own shares in a pooled fund, can borrow from the group, and receive a year-end payout based on how many shares they hold.

---

## Key Features

- Contribution tracking with proof-of-payment verification
- Loan management with interest calculations and approval workflow
- Share-based pool valuation that updates in real-time
- Transparent pool calculations visible to all members
- Projected year-end distribution with per-member payout estimates
- Admin controls for contributions, loans, member management, and configuration

---

## Dashboard Calculations

```
Share Value  = Pool Balance ÷ Shares Sold
Member Value = Shares Owned × Share Value
Profit       = Member Value − Contributions Paid
```

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| UI | Radix UI / shadcn, Lucide icons, Sonner toasts |
| Auth | AWS Cognito |
| Architecture | Feature-based |

---

## Getting Started

```bash
npm install
npm run dev    # development server
npm run build  # production build
```

Set `VITE_API_BASE_URL` in `.env` to point to your backend.

---

## Project Structure

```
src/
├── app/          # Routing, providers, global context
├── auth/         # Cognito auth, guards, permissions
├── features/     # One folder per domain (dashboard, loans, pool, etc.)
├── components/   # Shared layout and UI cards
├── hooks/        # Data-fetching hooks
├── services/     # API clients
├── utils/        # Currency, date, financial helpers
├── types/        # Shared TypeScript types
└── config/       # Feature flags, constants
```

---

## Roles

| Role | Access |
|------|--------|
| Member | View dashboard, contribute, request loans |
| Treasurer | All member actions + verify contributions, approve loans, record interest |
| Chairperson | Same as Treasurer |
| Admin | Full system access |

---

## Docs

Full documentation lives in the [`docs/`](./docs) folder:

- [Overview](./docs/overview.md) - what the platform does
- [Architecture](./docs/architecture.md) - how the code is structured
- [Flows](./docs/flows.md) - user journeys with Mermaid diagrams
- [Calculations](./docs/calculations.md) - pool and share value formulas
- [Components](./docs/components.md) - component and hook reference
