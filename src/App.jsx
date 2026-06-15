import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetTracker from './components/BudgetTracker';
import Analytics from './components/Analytics';
import InsightsCard from './components/InsightsCard';
import RecentActivity from './components/RecentActivity';
import QuickAdd from './components/QuickAdd';

const CATEGORIES = ['Food', 'Shopping', 'Travel', 'Education', 'Entertainment', 'Bills', 'Health', 'Other'];

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [transactions, setTransactions] = useState(() => loadFromStorage('smartspend_transactions', []));
  const [budget, setBudget] = useState(() => loadFromStorage('smartspend_budget', 0));
  const [theme, setTheme] = useState(() => loadFromStorage('smartspend_theme', 'light'));
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { saveToStorage('smartspend_transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('smartspend_budget', budget); }, [budget]);
  useEffect(() => {
    saveToStorage('smartspend_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const addTransaction = useCallback((txn) => {
    setTransactions(prev => [{ ...txn, id: Date.now(), date: txn.date || new Date().toISOString().split('T')[0] }, ...prev]);
    setShowForm(false);
  }, []);

  const updateTransaction = useCallback((txn) => {
    setTransactions(prev => prev.map(t => (t.id === txn.id ? txn : t)));
    setEditingTransaction(null);
    setShowForm(false);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const startEdit = useCallback((txn) => {
    setEditingTransaction(txn);
    setShowForm(true);
  }, []);

  const cancelForm = useCallback(() => {
    setEditingTransaction(null);
    setShowForm(false);
  }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">

        {/* Row 1: Summary Cards */}
        <DashboardCards income={income} expenses={expenses} savings={savings} budget={budget} />

        {/* Row 2: Quick Add */}
        <div className="card section-card">
          <h3 className="section-title">Quick Add</h3>
          <QuickAdd addTransaction={addTransaction} />
        </div>

        {/* Row 3: Two-column — Transactions (left) + Sidebar (right) */}
        <div className="grid-two">
          {/* Left: Transaction Form + List */}
          <div className="left-col">
            {showForm ? (
              <TransactionForm
                addTransaction={addTransaction}
                updateTransaction={updateTransaction}
                editingTransaction={editingTransaction}
                cancelForm={cancelForm}
                categories={CATEGORIES}
              />
            ) : (
              <button className="btn-primary add-btn" onClick={() => setShowForm(true)}>
                + Add Transaction
              </button>
            )}
            <TransactionList
              transactions={transactions}
              deleteTransaction={deleteTransaction}
              startEdit={startEdit}
              categories={CATEGORIES}
            />
          </div>

          {/* Right: Budget + Insights + Recent */}
          <div className="right-col">
            <BudgetTracker budget={budget} setBudget={setBudget} expenses={expenses} />
            <InsightsCard transactions={transactions} income={income} expenses={expenses} savings={savings} budget={budget} />
            <RecentActivity transactions={transactions} />
          </div>
        </div>

        {/* Row 4: Full-width Analytics */}
        <Analytics transactions={transactions} />

      </main>
      <footer className="footer">
        <p>SmartSpend &copy; {new Date().getFullYear()} | Built with React.js</p>
      </footer>
    </div>
  );
}
