import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      aria-label="Tema o'zgartirish"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 flex items-center justify-center
          ${dark ? 'translate-x-6 bg-green-400' : 'translate-x-0 bg-white shadow'}`}
      >
        {dark
          ? <Moon size={12} className="text-black" />
          : <Sun size={12} className="text-green-400" />
        }
      </span>
    </button>
  );
}
