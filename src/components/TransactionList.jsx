import { useState, useEffect, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function categoryIcon(cat) {
  const map = {
    Food: '🍔', Shopping: '🛍️', Travel: '✈️', Education: '📚',
    Entertainment: '🎬', Bills: '📄', Health: '❤️', Other: '📌',
  };
  return map[cat] || '📌';
}

function loadPref(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function TransactionList({ transactions, deleteTransaction, startEdit }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(() => loadPref('smartspend_filter', 'all'));
  const [sortNewest, setSortNewest] = useState(() => loadPref('smartspend_sort_newest', true));

  // Persist filter and sort preferences immediately on change
  useEffect(() => {
    localStorage.setItem('smartspend_filter', JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('smartspend_sort_newest', JSON.stringify(sortNewest));
  }, [sortNewest]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') list = list.filter(t => t.type === filter);
    list.sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date);
      return sortNewest ? db - da : da - db;
    });
    return list;
  }, [transactions, search, filter, sortNewest]);

  const exportCSV = () => {
    const header = 'Title,Amount,Category,Date,Type\n';
    const rows = transactions
      .map(t => `"${t.title}",${t.amount},"${t.category}","${t.date}","${t.type}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartspend_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (transactions.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">📝</span>
        <p>No transactions yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="card txn-list-card">
      <div className="txn-list-header">
        <h3>Transactions</h3>
        <button className="btn-secondary btn-sm" onClick={exportCSV}>
          Export CSV
        </button>
      </div>
      <div className="txn-filters">
        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button className="btn-secondary btn-sm" onClick={() => setSortNewest(s => !s)}>
          {sortNewest ? 'Newest' : 'Oldest'}
        </button>
      </div>
      <ul className="txn-list">
        {filtered.map(t => (
          <li key={t.id} className={`txn-item ${t.type}`}>
            <span className="txn-cat-icon">{categoryIcon(t.category)}</span>
            <div className="txn-details">
              <span className="txn-title">{t.title}</span>
              <span className="txn-meta">{t.category} &middot; {t.date}</span>
            </div>
            <span className={`txn-amount ${t.type}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
            <div className="txn-actions">
              <button onClick={() => startEdit(t)} aria-label="Edit"><FiEdit2 /></button>
              <button onClick={() => deleteTransaction(t.id)} aria-label="Delete"><FiTrash2 /></button>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No matching transactions.</p>
        )}
      </ul>
    </div>
  );
}
