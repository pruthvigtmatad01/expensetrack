const quickButtons = [
  { label: '+₹100 Food', amount: 100, category: 'Food', type: 'expense' },
  { label: '+₹500 Shopping', amount: 500, category: 'Shopping', type: 'expense' },
  { label: '+₹200 Travel', amount: 200, category: 'Travel', type: 'expense' },
  { label: '+₹1000 Education', amount: 1000, category: 'Education', type: 'expense' },
];

export default function QuickAdd({ addTransaction }) {
  return (
    <div className="quick-add">
      {quickButtons.map(b => (
        <button
          key={b.label}
          className="quick-btn"
          onClick={() => addTransaction({ title: b.category, amount: b.amount, category: b.category, type: b.type })}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
