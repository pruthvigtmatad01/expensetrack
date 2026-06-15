import { useState } from 'react';

export default function TransactionForm({ addTransaction, updateTransaction, editingTransaction, cancelForm, categories }) {
  const [title, setTitle] = useState(editingTransaction?.title || '');
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [category, setCategory] = useState(editingTransaction?.category || 'Food');
  const [type, setType] = useState(editingTransaction?.type || 'expense');
  const [date, setDate] = useState(editingTransaction?.date || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    const num = parseFloat(amount);

    if (!trimmed) { setError('Title is required'); return; }
    if (!amount || isNaN(num) || num <= 0) { setError('Enter a valid positive amount'); return; }

    const txn = { title: trimmed, amount: num, category, type, date };
    if (editingTransaction) {
      updateTransaction({ ...txn, id: editingTransaction.id });
    } else {
      addTransaction(txn);
    }
    setTitle(''); setAmount(''); setCategory('Food'); setType('expense');
    setDate(new Date().toISOString().split('T')[0]); setError('');
  };

  return (
    <div className="card form-card">
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="txn-form">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Amount" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="type-toggle">
          <label className={type === 'income' ? 'active income' : ''}>
            <input type="radio" name="type" checked={type === 'income'} onChange={() => setType('income')} /> Income
          </label>
          <label className={type === 'expense' ? 'active expense' : ''}>
            <input type="radio" name="type" checked={type === 'expense'} onChange={() => setType('expense')} /> Expense
          </label>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <div className="form-actions">
          <button type="submit" className="btn-primary">{editingTransaction ? 'Update' : 'Add'}</button>
          <button type="button" className="btn-secondary" onClick={cancelForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
