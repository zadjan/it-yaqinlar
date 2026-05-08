import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/meetups', label: 'Meetuplar' },
  { to: '/history', label: 'Tarix' },
  { to: '/founder', label: 'Asoschimiz' },
  { to: '/contact', label: 'Aloqa' },
];

export default function Navbar({ dark, setDark }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#e0e0e0]/90 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-300 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="IT Yaqinlar"
            style={{ height: '44px', width: '44px', borderRadius: '50%' }}
          />
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            IT <span className="text-green-400">Yaqinlar</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? 'bg-green-400 text-black'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-[#d0d0d0] dark:hover:bg-gray-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle dark={dark} setDark={setDark} />
          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-[#d0d0d0] dark:hover:bg-gray-800"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-5 space-y-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#e0e0e0] dark:bg-[#111] border-t border-gray-300 dark:border-gray-800 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium border-b border-[#d0d0d0] dark:border-gray-800 transition-colors ${
                pathname === l.to
                  ? 'text-green-400 bg-green-50 dark:bg-green-400/10'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
