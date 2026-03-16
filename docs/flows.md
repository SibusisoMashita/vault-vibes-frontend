# User Flows

Key journeys through the app - from login to year-end payout.

---

## Login

```mermaid
flowchart TD
    Open[Open App] --> AuthGuard
    AuthGuard -->|has token| App
    AuthGuard -->|no token| LoginPage
    LoginPage --> CognitoHosted[Cognito Hosted UI]
    CognitoHosted -->|auth code| AuthCallback
    AuthCallback -->|store token| LocalStorage
    LocalStorage --> App
```

---

## Invite a new member

```mermaid
flowchart TD
    Admin -->|Members page| InviteForm
    InviteForm -->|name + phone + role + shares| API[POST /invitations]
    API -->|creates Cognito user| Cognito
    Cognito -->|sends OTP via SMS| Member
    Member -->|logs in| LoginPage
    LoginPage -->|first login| ActivateAccount
    ActivateAccount -->|set password| App
```

---

## Make a contribution

```mermaid
flowchart TD
    Member -->|clicks Contribute| ContributionModal
    ContributionModal -->|upload proof of payment| API[POST /contributions]
    API -->|status: PENDING| Ledger
    Treasurer -->|Admin Contributions page| ReviewProof
    ReviewProof -->|Verify| API2[PATCH /contributions/:id/verify]
    API2 -->|status: VERIFIED| Pool
    Pool -->|balance updated| Dashboard
```

---

## Request a loan

```mermaid
flowchart TD
    Member -->|clicks Request Borrowing| LoanModal
    LoanModal -->|enter amount| Preview[Preview repayment]
    Preview -->|submit| API[POST /loans]
    API -->|status: pending| Treasurer
    Treasurer -->|Admin Loans page| Decision{Approve?}
    Decision -->|yes| API2[PATCH /loans/:id/approve]
    Decision -->|no| API3[PATCH /loans/:id/reject]
    API2 -->|status: active| Member
    Member -->|repays| Treasurer2[Mark as Repaid]
    Treasurer2 --> API4[PATCH /loans/:id/repay]
    API4 -->|status: repaid, interest returned to pool| Pool
```

---

## Dashboard calculation flow

```mermaid
flowchart TD
    Contributions --> CapitalReceived
    BankInterest --> PoolBalance
    CapitalReceived --> PoolBalance
    ActiveLoans --> PoolBalance
    PoolBalance --> PerShareValue[Pool Value ÷ Shares Sold]
    PerShareValue --> MemberValue[Shares Owned × Per Share Value]
    MemberValue --> Profit[Member Value − Paid So Far]
```

---

## Year-end distribution

```mermaid
flowchart TD
    YearEnd[Year-End Date] --> FinalPool[Final Pool Balance]
    FinalPool --> PerShare[Per Share Value = Pool ÷ Sold Shares]
    PerShare --> Payout[Member Payout = Shares × Per Share Value]
    Payout --> Distribute[Distribute to each member]
```
