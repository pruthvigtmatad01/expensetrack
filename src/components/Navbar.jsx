import { useState } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="logo">💰</span>
          <span className="brand-text">SmartSpend</span>
        </div>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
