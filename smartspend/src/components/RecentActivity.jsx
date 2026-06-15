function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function categoryIcon(cat) {
  const map = { Food: '🍔', Shopping: '🛍️', Travel: '✈️', Education: '📚', Entertainment: '🎬', Bills: '📄', Health: '❤️', Other: '📌' };
  return map[cat] || '📌';
}

export default function RecentActivity({ transactions }) {
  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">📋</span>
        <p>No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="card recent-card">
      <h3>Recent Activity</h3>
      <ul className="recent-list">
        {recent.map(t => (
          <li key={t.id} className="recent-item">
            <span className="recent-icon">{categoryIcon(t.category)}</span>
            <div className="recent-info">
              <span className="recent-title">{t.title}</span>
              <span className="recent-meta">{t.category} &middot; {t.date}</span>
            </div>
            <span className={`recent-amount ${t.type}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
