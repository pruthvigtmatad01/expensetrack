import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiShield, FiTarget } from 'react-icons/fi';

const cards = [
  { key: 'balance', label: 'Total Balance', icon: FiDollarSign, color: '#1976D2' },
  { key: 'income', label: 'Total Income', icon: FiTrendingUp, color: '#2e7d32' },
  { key: 'expenses', label: 'Total Expenses', icon: FiTrendingDown, color: '#c62828' },
  { key: 'savings', label: 'Total Savings', icon: FiShield, color: '#f57f17' },
  { key: 'budget', label: 'Budget Status', icon: FiTarget, color: '#6a1b9a' },
];

function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function DashboardCards({ income, expenses, savings, budget }) {
  const values = {
    balance: savings,
    income,
    expenses,
    savings,
    budget: budget > 0 ? `${Math.min(Math.round((expenses / budget) * 100), 999)}% used` : 'No budget',
  };

  return (
    <div className="dashboard-cards">
      {cards.map(c => {
        const Icon = c.icon;
        const val = values[c.key];
        return (
          <div className="dash-card" key={c.key} style={{ '--accent': c.color }}>
            <div className="dash-card-icon">
              <Icon />
            </div>
            <div className="dash-card-info">
              <span className="dash-card-label">{c.label}</span>
              <span className="dash-card-value">
                {typeof val === 'number' ? formatCurrency(val) : val}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
