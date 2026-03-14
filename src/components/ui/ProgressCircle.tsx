interface ProgressCircleProps {
  progress: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
}

export function ProgressCircle({
  progress,
  className,
  trackClassName = 'opacity-30',
  progressClassName = 'transition-all duration-1000',
}: ProgressCircleProps) {
  const radius = 36;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const dashOffset = circumference * (1 - clampedProgress / 100);

  return (
	<div className={className}>
	  <svg className="transform -rotate-90 w-full h-full">
		<circle
		  cx="50%"
		  cy="50%"
		  r={radius}
		  stroke="currentColor"
		  strokeWidth={strokeWidth}
		  fill="none"
		  className={trackClassName}
		/>
		<circle
		  cx="50%"
		  cy="50%"
		  r={radius}
		  stroke="currentColor"
		  strokeWidth={strokeWidth}
		  fill="none"
		  strokeDasharray={circumference}
		  strokeDashoffset={dashOffset}
		  strokeLinecap="round"
		  className={progressClassName}
		/>
	  </svg>
	</div>
  );
}

