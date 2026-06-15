import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const PIE_COLORS = ['#1976D2', '#c62828', '#2e7d32', '#f57f17', '#6a1b9a', '#00838f', '#d84315', '#455a64'];

export default function Analytics({ transactions }) {
  const { barData, pieData, lineData } = useMemo(() => {
    const expenseTxns = transactions.filter(t => t.type === 'expense');

    const months = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    const barData = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));

    const cats = {};
    expenseTxns.forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
    const pieData = Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const lineData = barData.map(d => ({ month: d.month, Income: d.income, Expense: d.expense }));

    return { barData, pieData, lineData };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="card analytics-empty">
        <span className="empty-icon">📊</span>
        <p>Add transactions to see analytics charts here.</p>
      </div>
    );
  }

  return (
    <div className="card analytics-card">
      <h3>Analytics</h3>
      <div className="charts-grid">
        {barData.length > 0 && (
          <div className="chart-box">
            <h4>Income vs Expense</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis fontSize={11} tick={{ fill: 'var(--text-secondary)' }} width={60} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="income" fill="#2e7d32" name="Income" radius={[4,4,0,0]} />
                <Bar dataKey="expense" fill="#c62828" name="Expense" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {pieData.length > 0 && (
          <div className="chart-box">
            <h4>Expense by Category</h4>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {lineData.length > 0 && (
          <div className="chart-box">
            <h4>Monthly Trend</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis fontSize={11} tick={{ fill: 'var(--text-secondary)' }} width={60} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#2e7d32" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Expense" stroke="#c62828" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
