import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Landmark,
  Menu,
  ReceiptText,
  Shield,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const trustItems = [
  'Clear member records',
  'Transparent group balances',
  'Controlled loan approvals',
  'Invitation-only access',
];

const operationsCards = [
  {
    title: 'Track contributions',
    description:
      'Keep a clear record of who has paid, who is behind, and how the group is progressing.',
    icon: ReceiptText,
  },
  {
    title: 'Manage borrowing',
    description:
      'Handle loan requests with clear rules, approvals, repayments, and visibility for the group.',
    icon: Landmark,
  },
  {
    title: 'See member ownership',
    description:
      'Give every member a simple view of their shares, contribution progress, and projected value.',
    icon: Wallet,
  },
  {
    title: 'Prepare payouts',
    description:
      'Keep the numbers in order throughout the year so distributions are easier to manage when the time comes.',
    icon: CreditCard,
  },
];

const trustCards = [
  {
    title: 'One shared source of truth',
    description:
      'Contributions, loans, repayments, and payouts are recorded in one place.',
    icon: CheckCircle2,
  },
  {
    title: 'Visibility for members',
    description:
      'Members can see their progress without waiting for manual updates.',
    icon: Users,
  },
  {
    title: 'Control for admins',
    description:
      'Group leaders can manage approvals, monitor risk, and keep operations organised.',
    icon: Shield,
  },
];

const audienceCards = [
  {
    title: 'For treasurers and group leaders',
    description:
      'Spend less time chasing records, answering balance questions, and managing loan decisions manually.',
  },
  {
    title: 'For members',
    description:
      'See your shares, contributions, and expected value in a simple, private account.',
  },
];

export function MarketingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#fcfdff_0%,#f3f7fc_44%,#ffffff_100%)] text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_58%)]" />

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-slate-200/80 bg-white/88 shadow-sm backdrop-blur-xl'
            : 'border-transparent bg-white/72 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon-32x32.png" alt="Vault Vibes logo" className="h-10 w-10 rounded-xl" />
            <p className="text-lg font-semibold tracking-tight text-slate-950">Vault Vibes</p>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#how-access-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-slate-50"
            >
              How access works
            </a>
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900"
            >
              Member login
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#how-access-works"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                How access works
              </a>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:bg-slate-900"
              >
                Member login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <section className="border-b border-slate-200/80">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Built for real stokvel operations
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                Run your stokvel with clarity.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Vault Vibes helps your group manage contributions, borrowing, member ownership, and payouts in one trusted system.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-1 hover:bg-slate-900"
                >
                  Member login
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-access-works"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-slate-50"
                >
                  How access works
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Why groups trust Vault Vibes</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Clear records. Visible balances. Fair processes.
                </h2>

                <div className="mt-6 space-y-4">
                  {[
                    'Members see what they have paid and what they own.',
                    'Admins manage approvals and group rules in one place.',
                    'The pool stays visible to the whole group.',
                    'Every transaction is recorded in a shared ledger.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Built for trust</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  When the records are clear, the group runs better.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Stokvels work on trust. Vault Vibes strengthens that trust with clear records, visible balances, and fair processes that members can follow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">What it helps you do</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
              Everything needed to run the group properly
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {operationsCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(15,23,42,0.08)]"
                >
                  <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/80">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Built for trust</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                When the records are clear, the group runs better
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Vault Vibes gives members and admins one reliable place to follow the state of the group.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {trustCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.05)]"
                  >
                    <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Who it&apos;s for</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                Designed for the people doing the work
              </h2>
            </div>

            <div className="grid gap-4">
              {audienceCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.05)]"
                >
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-access-works" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">How access works</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em]">
                Private by default
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Vault Vibes is invitation-only. Each member joins through their group, keeping access controlled and records connected to the right stokvel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-slate-100"
                >
                  Member login
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/5"
                >
                  Back to top
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
