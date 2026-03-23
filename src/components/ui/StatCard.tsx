import type { LucideIcon } from 'lucide-react';

type StatColor = 'blue' | 'green' | 'purple' | 'amber';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: StatColor;
}

const colorStyles: Record<StatColor, string> = {
  blue: 'from-primary-muted to-transparent border-primary/30',
  green: 'from-success-muted to-transparent border-success/30',
  purple: 'from-purple-muted to-transparent border-purple/30',
  amber: 'from-amber-muted to-transparent border-amber/30',
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} border rounded-xl p-5`}>
      <Icon className="w-5 h-5 text-foreground-muted mb-3" />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-foreground-muted mt-1">{label}</p>
    </div>
  );
}
