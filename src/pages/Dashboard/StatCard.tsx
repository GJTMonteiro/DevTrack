import './StatCard.css';

import type { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: number | string;
  description: string;
};

function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <h3 className="stat-title">{title}</h3>

      <h2 className="stat-value">{value}</h2>

      <p className="stat-description">{description}</p>
    </div>
  );
}

export default StatCard;
