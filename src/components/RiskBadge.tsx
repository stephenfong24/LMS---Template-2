import type { RiskScore } from '../types';

interface RiskBadgeProps {
  score: RiskScore;
}

export function RiskBadge({ score }: RiskBadgeProps) {
  const className =
    score === 'Low' ? 'risk-badge risk-low' : score === 'Medium' ? 'risk-badge risk-medium' : 'risk-badge risk-high';

  return <span className={className}>{score}</span>;
}