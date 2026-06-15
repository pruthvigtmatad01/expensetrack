import { useState } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function BudgetTracker({ budget, setBudget, expenses }) {
  const [inputBudget, setInputBudget] = useState('');
  const [editing, setEditing] = useState(budget === 0);

  const remaining = budget - expenses;
  const pct = budget > 0 ? Math.min(Math.round((expenses / budget) * 100), 100) : 0;
  const overBudget = expenses > budget && budget > 0;

  let status, StatusIcon;
  if (budget === 0) { status = 'No budget set'; StatusIcon = null; }
  else if (pct < 60) { status = 'Within budget'; StatusIcon = FiCheckCircle; }
  else if (pct < 90) { status = 'Close to limit'; StatusIcon = FiAlertTriangle; }
  else { status = overBudget ? 'Budget exceeded!' : 'Close to limit'; StatusIcon = overBudget ? FiXCircle : FiAlertTriangle; }

  const handleSet = () => {
    const val = parseFloat(inputBudget);
    if (!inputBudget || isNaN(val) || val <= 0) return;
    setBudget(val);
    setInputBudget('');
    setEditing(false);
  };

  if (budget === 0 || editing) {
    return (
      <div className="card budget-card">
        <h3>Monthly Budget</h3>
        <div className="budget-input-row">
          <input type="number" placeholder="Set budget amount" min="0" step="100" value={inputBudget} onChange={e => setInputBudget(e.target.value)} />
          <button className="btn-primary btn-sm" onClick={handleSet}>Set</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card budget-card">
      <div className="budget-header">
        <h3>Monthly Budget</h3>
        <button className="btn-secondary btn-sm" onClick={() => { setEditing(true); setInputBudget(budget.toString()); }}>Edit</button>
      </div>
      <div className="budget-info">
        <p>Budget: {formatCurrency(budget)}</p>
        <p>Spent: {formatCurrency(expenses)}</p>
        <p className={overBudget ? 'text-danger' : 'text-success'}>Remaining: {formatCurrency(remaining)}</p>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${pct}%`, background: overBudget ? '#c62828' : pct > 70 ? '#f57f17' : '#2e7d32' }} />
      </div>
      <p className="budget-pct">{pct}% used</p>
      <div className="budget-status">
        {StatusIcon && <StatusIcon />}
        <span>{status}</span>
      </div>
    </div>
  );
}
