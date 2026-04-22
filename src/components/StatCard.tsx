interface StatCardProps {
  title: string;
  value: number;
  accentClass?: string;
}

export function StatCard({ title, value, accentClass = '' }: StatCardProps) {
  return (
    <article className={`card stat-card ${accentClass}`.trim()}>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </article>
  );
}