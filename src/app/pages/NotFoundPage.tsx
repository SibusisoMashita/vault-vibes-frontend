import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        The route you requested does not exist or is no longer available.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        Go to website
      </Link>
    </div>
  );
}
