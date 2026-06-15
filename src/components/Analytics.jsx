import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#1976D2', '#c62828', '#2e7d32', '#f57f17', '#6a1b9a', '#00838f', '#d84315', '#455a64'];

export default function Analytics({ transactions }) {
  const { barData, pieData, lineData } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income');
    const expense = transactions.filter(t => t.type === 'expense');

    // Monthly income vs expense for bar chart
    const months = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { month: m, income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    const barData = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));

    // Expense category pie chart
    const cats = {};
    expense.forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    const pieData = Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Monthly trend line chart
    const lineData = barData.map(d => ({ month: d.month, Income: d.income, Expense: d.expense }));

    return { barData, pieData, lineData };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">📊</span>
        <p>Add transactions to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="card analytics-card">
      <h3>Analytics</h3>
      {barData.length > 0 && (
        <div className="chart-section">
          <h4>Income vs Expense</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="income" fill="#2e7d32" name="Income" />
              <Bar dataKey="expense" fill="#c62828" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {pieData.length > 0 && (
        <div className="chart-section">
          <h4>Expense by Category</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine fontSize={11}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {lineData.length > 0 && (
        <div className="chart-section">
          <h4>Monthly Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#2e7d32" strokeWidth={2} />
              <Line type="monotone" dataKey="Expense" stroke="#c62828" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
