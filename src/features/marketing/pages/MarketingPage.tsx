import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Building2, CheckCircle2, Menu, Shield, TrendingUp, Users, Wallet, X, Lock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const audienceCards = [
  {
    title: 'For groups',
    description: 'Run your stokvel with one clear system for contributions, loans, member records, and year-end distributions.',
    icon: Users,
  },
  {
    title: 'For members',
    description: 'See your shares, your contribution progress, and your projected value without waiting for month-end updates.',
    icon: Wallet,
  },
  {
    title: 'For investors',
    description: 'Back a product solving a real financial behavior with repeat usage, trust, and room to scale across many groups.',
    icon: TrendingUp,
  },
];

const featureCards = [
  {
    title: 'Simple dashboard',
    description: 'The same clean experience used inside the app: share value, pool value, activity, and actions in one place.',
    icon: BarChart3,
  },
  {
    title: 'Real financial transparency',
    description: 'A shared ledger gives every group a single source of truth for contributions, borrowings, and payouts.',
    icon: Shield,
  },
  {
    title: 'Built to scale operations',
    description: 'Admins can verify contributions, manage roles, and approve loans as the product grows beyond one group.',
    icon: Building2,
  },
];

const growthSignals = [
  {
    label: 'Today',
    value: '1 live group',
    description: 'A real operating group gives the product grounded feedback and real-world proof.',
  },
  {
    label: 'Next',
    value: 'Many groups',
    description: 'The product model is designed to onboard more stokvels without changing the core experience.',
  },
  {
    label: 'Value',
    value: 'Recurring trust',
    description: 'Groups come back monthly, members check progress often, and admins rely on the system to run operations.',
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
    <div className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f8fbff_0%,#eff6ff_40%,#ffffff_100%)] text-foreground">
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-blue-200/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-[-4rem] h-56 w-56 rounded-full bg-sky-100/80 blur-3xl" />

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-blue-100/80 bg-white/80 shadow-sm backdrop-blur-xl'
            : 'border-transparent bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon-32x32.png" alt="Vault Vibes logo" className="h-10 w-10 rounded-xl" />
            <div>
              <p className="text-lg font-semibold tracking-tight">Vault Vibes</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
            >
              Member login
            </Link>
            <Link
              to="/app/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_10px_30px_rgba(59,130,246,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_16px_36px_rgba(59,130,246,0.34)]"
            >
              Open app
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-white/80 text-foreground shadow-sm transition hover:bg-blue-50 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-blue-100/80 bg-white/90 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-blue-50"
              >
                Member login
              </Link>
              <Link
                to="/app/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_10px_30px_rgba(59,130,246,0.28)] transition hover:bg-accent/90"
              >
                Open app
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <section className="border-b border-blue-100/70 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(255,255,255,0))]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4" />
                Built from a real stokvel workflow
              </div>

              <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                A simple digital home for{' '}
                <span className="bg-[linear-gradient(90deg,#3b82f6,#6366f1)] bg-clip-text text-transparent">
                  stokvels
                </span>{' '}
                that want to grow with confidence.
              </h1>

              <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Vault Vibes helps groups manage contributions, lending, member ownership, and distributions in one clear product.
                It feels simple for members, useful for leaders, and promising for investors watching the category.
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_16px_36px_rgba(59,130,246,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-accent/90 hover:shadow-[0_22px_44px_rgba(59,130,246,0.36)]"
                >
                  See the product
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white/80 px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
                >
                  Join by invitation
                </Link>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 grid gap-4">
              <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Why people trust it</p>
                    <h2 className="mt-2 text-2xl font-semibold">The app stays easy because the model is clear.</h2>
                  </div>
                  <Wallet className="h-10 w-10 text-accent" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="group rounded-2xl border border-blue-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/80 hover:shadow-md">
                    <Users className="h-5 w-5 text-accent transition duration-200 group-hover:scale-105" />
                    <p className="mt-3 text-sm text-muted-foreground">Members</p>
                    <p className="mt-1 font-semibold">Track contributions and projected value</p>
                  </div>
                  <div className="group rounded-2xl border border-blue-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/80 hover:shadow-md">
                    <Shield className="h-5 w-5 text-accent transition duration-200 group-hover:scale-105" />
                    <p className="mt-3 text-sm text-muted-foreground">Admins</p>
                    <p className="mt-1 font-semibold">Manage approvals and group rules</p>
                  </div>
                  <div className="group rounded-2xl border border-blue-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/80 hover:shadow-md">
                    <Wallet className="h-5 w-5 text-accent transition duration-200 group-hover:scale-105" />
                    <p className="mt-3 text-sm text-muted-foreground">Pool</p>
                    <p className="mt-1 font-semibold">See cash, borrowings, and ownership together</p>
                  </div>
                  <div className="group rounded-2xl border border-blue-100/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/80 hover:shadow-md">
                    <TrendingUp className="h-5 w-5 text-accent transition duration-200 group-hover:scale-105" />
                    <p className="mt-3 text-sm text-muted-foreground">Growth</p>
                    <p className="mt-1 font-semibold">Ready to support more groups over time</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current story</p>
                <p className="mt-2 text-3xl font-semibold">One group today. Platform potential tomorrow.</p>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  Vault Vibes already solves a real operating need. That gives the product a better expansion story than a concept-stage idea.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Who this serves</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              The site should make every audience understand the value quickly.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(15,23,42,0.12)]">
                  <div className="inline-flex rounded-2xl bg-accent/10 p-3 text-accent shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-blue-100/70 bg-[linear-gradient(180deg,rgba(239,246,255,0.9),rgba(255,255,255,0.9))]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Why Vault Vibes matters</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                It brings structure to a trusted community financial model.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(15,23,42,0.12)]">
                    <Icon className="h-7 w-7 text-accent" />
                    <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Investor signal</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                Early traction is small, but the value proposition is already visible.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                The story for investors is not about claiming scale too early. It is about showing a real use case, a repeatable workflow, and a product designed to expand from one active group into many.
              </p>
            </div>

            <div className="grid gap-4">
              {growthSignals.map((signal) => (
                <div key={signal.label} className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_72px_rgba(15,23,42,0.12)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{signal.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{signal.value}</p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{signal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-blue-100/70 bg-white/70">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
            <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next move</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em]">
                Position Vault Vibes as the easiest way for a stokvel to run like a modern financial product.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                That message attracts groups looking for structure, members looking for clarity, and investors looking for a credible path to growth.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_16px_36px_rgba(59,130,246,0.28)] transition duration-200 hover:-translate-y-1 hover:bg-accent/90 hover:shadow-[0_22px_44px_rgba(59,130,246,0.36)]"
                >
                  Explore the app
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white/80 px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
                >
                  Member sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-blue-100/80 bg-white/90 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-3 gap-2 text-center">
          <a
            href="#"
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-blue-50 hover:text-foreground"
          >
            <BarChart3 className="mb-1 h-4 w-4 text-accent" />
            Details
          </a>
          <Link
            to="/login"
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-blue-50 hover:text-foreground"
          >
            <Lock className="mb-1 h-4 w-4 text-accent" />
            Lock
          </Link>
          <Link
            to="/app/settings"
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-blue-50 hover:text-foreground"
          >
            <Settings className="mb-1 h-4 w-4 text-accent" />
            Settings
          </Link>
        </div>
      </nav>
    </div>
  );
}
