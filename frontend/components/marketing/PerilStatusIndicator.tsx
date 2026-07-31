interface PerilStatusIndicatorProps {
  status: 'production' | 'validation' | 'roadmap';
  label: string;
}

export function PerilStatusIndicator({
  status,
  label,
}: PerilStatusIndicatorProps) {
  const statusColors = {
    production: 'bg-status-ok',
    validation: 'bg-status-warn',
    roadmap: 'bg-muted',
  };

  return (
    <div className="flex items-center gap-space-2">
      <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
      <span className="text-small text-white">{label}</span>
    </div>
  );
}
