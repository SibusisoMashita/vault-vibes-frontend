import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
  iconClassName?: string;
  iconContainerClassName?: string;
  footnote?: string;
}

export function ValueCard({
  icon: Icon,
  label,
  value,
  className = '',
  iconClassName = '',
  iconContainerClassName = '',
  footnote,
}: ValueCardProps) {
  return (
    <div className={`bg-card rounded-2xl p-6 border border-border ${className}`.trim()}>
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconContainerClassName}`.trim()}
        >
          <Icon className={`w-5 h-5 ${iconClassName}`.trim()} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-3xl font-bold tabular-nums${footnote ? ' mb-1' : ''}`}>{value}</p>
      {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
    </div>
  );
}

