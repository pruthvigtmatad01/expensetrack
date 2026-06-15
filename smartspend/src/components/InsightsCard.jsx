import { useMemo } from 'react';

function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function InsightsCard({ transactions, income, expenses, savings, budget }) {
  const insights = useMemo(() => {
    const msgs = [];
    if (transactions.length === 0) return msgs;

    const expenseTxns = transactions.filter(t => t.type === 'expense');
    const incomeTxns = transactions.filter(t => t.type === 'income');

    // Highest expense category
    const catTotals = {};
    expenseTxns.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCat) msgs.push(`${topCat[0]} is your highest spending category.`);

    // Monthly savings
    if (savings > 0) msgs.push(`You saved ${formatCurrency(savings)} this month.`);
    else if (savings < 0) msgs.push(`You overspent ${formatCurrency(Math.abs(savings))} this month.`);

    // Budget status
    if (budget > 0) {
      const pct = Math.round((expenses / budget) * 100);
      if (pct <= 80) msgs.push('You are within budget.');
      else if (pct <= 100) msgs.push('Your spending is close to the limit.');
      else msgs.push('You have exceeded your budget!');
    }

    // Extra stats
    if (expenseTxns.length > 0) {
      const avgExp = expenses / expenseTxns.length;
      msgs.push(`Average expense: ${formatCurrency(Math.round(avgExp))}`);
      const highest = expenseTxns.reduce((max, t) => t.amount > max.amount ? t : max);
      msgs.push(`Highest expense: ${highest.title} (${formatCurrency(highest.amount)})`);
    }
    if (incomeTxns.length > 0) {
      const avgInc = income / incomeTxns.length;
      msgs.push(`Average income: ${formatCurrency(Math.round(avgInc))}`);
      const highest = incomeTxns.reduce((max, t) => t.amount > max.amount ? t : max);
      msgs.push(`Highest income: ${highest.title} (${formatCurrency(highest.amount)})`);
    }

    msgs.push(`Total transactions: ${transactions.length}`);
    if (budget > 0) msgs.push(`Budget usage: ${Math.round((expenses / budget) * 100)}%`);

    return msgs;
  }, [transactions, income, expenses, savings, budget]);

  if (insights.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">💡</span>
        <p>Add transactions to see insights.</p>
      </div>
    );
  }

  return (
    <div className="card insights-card">
      <h3>Spending Insights</h3>
      <ul className="insights-list">
        {insights.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </div>
  );
}
