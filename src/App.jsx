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

// ── Storage helpers ────────────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently continue
  }
}

// ── Data validators — prevent corrupted data from crashing the app ─────────────
function validateTransactions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(t =>
    t &&
    typeof t.id === 'number' &&
    typeof t.title === 'string' && t.title.trim() !== '' &&
    typeof t.amount === 'number' && t.amount > 0 &&
    typeof t.category === 'string' &&
    (t.type === 'income' || t.type === 'expense') &&
    typeof t.date === 'string'
  );
}

function validateBudget(raw) {
  const n = parseFloat(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function validateTheme(raw) {
  return raw === 'dark' ? 'dark' : 'light';
}

// Apply theme to <html> immediately (before first render) to prevent flash
const initialTheme = validateTheme(load('smartspend_theme', 'light'));
document.documentElement.setAttribute('data-theme', initialTheme);

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [transactions, setTransactions] = useState(() =>
    validateTransactions(load('smartspend_transactions', []))
  );
  const [budget, setBudgetState] = useState(() =>
    validateBudget(load('smartspend_budget', 0))
  );
  const [theme, setTheme] = useState(initialTheme);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Persist every change immediately
  useEffect(() => { save('smartspend_transactions', transactions); }, [transactions]);
  useEffect(() => { save('smartspend_budget', budget); }, [budget]);
  useEffect(() => {
    save('smartspend_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  // Wrap setBudget so it always validates before saving
  const setBudget = useCallback((val) => {
    setBudgetState(validateBudget(val));
  }, []);

  const addTransaction = useCallback((txn) => {
    const newTxn = {
      id: Date.now(),
      title: String(txn.title).trim(),
      amount: parseFloat(txn.amount),
      category: txn.category,
      type: txn.type,
      date: txn.date || new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTxn, ...prev]);
    setShowForm(false);
  }, []);

  const updateTransaction = useCallback((txn) => {
    setTransactions(prev => prev.map(t => (t.id === txn.id ? { ...txn } : t)));
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

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <DashboardCards
          income={income}
          expenses={expenses}
          savings={savings}
          budget={budget}
        />
        <div className="grid-two">
          <div className="left-col">
            <QuickAdd addTransaction={addTransaction} />
            {showForm ? (
              <TransactionForm
                addTransaction={addTransaction}
                updateTransaction={updateTransaction}
                editingTransaction={editingTransaction}
                cancelForm={cancelForm}
                categories={CATEGORIES}
              />
            ) : (
              <button
                className="btn-primary add-btn"
                onClick={() => setShowForm(true)}
              >
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
          <div className="right-col">
            <BudgetTracker
              budget={budget}
              setBudget={setBudget}
              expenses={expenses}
            />
            <Analytics transactions={transactions} />
            <InsightsCard
              transactions={transactions}
              income={income}
              expenses={expenses}
              savings={savings}
              budget={budget}
            />
            <RecentActivity transactions={transactions} />
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>SmartSpend &copy; {new Date().getFullYear()} | Developed by -Pruthvi GT Matad</p>
      </footer>
    </div>
  );
}
