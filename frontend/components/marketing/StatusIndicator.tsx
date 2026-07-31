interface StatusIndicatorProps {
  status: 'production' | 'validation' | 'roadmap';
  label: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const statusDotColor = {
    production: 'bg-green-500',
    validation: 'bg-amber-500',
    roadmap: 'bg-gray-400',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${statusDotColor[status]}`} />
      <span className="text-sm font-medium text-text-muted">
        {status === 'production' && 'Live: '}
        {status === 'validation' && 'Ingesting: '}
        {label}
      </span>
    </div>
  );
}
