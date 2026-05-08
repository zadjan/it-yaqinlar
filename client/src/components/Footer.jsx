import { Link } from 'react-router-dom';
import { Send, Camera, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-glass mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="IT Yaqinlar" className="h-8 w-8 rounded-md object-contain" onError={e => e.target.style.display='none'} />
              <span className="font-bold text-white">
                IT <span className="text-green-400">Yaqinlar</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              IT sohasida yaqin bo'lamiz
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Sahifalar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Bosh sahifa' },
                { to: '/meetups', label: 'Meetuplar' },
                { to: '/history', label: 'Tarix' },
                { to: '/founder', label: 'Asoschimiz' },
                { to: '/contact', label: 'Aloqa' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Ijtimoiy tarmoqlar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://t.me/it_yaqinlar" target="_blank" rel="noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-3">
                  <div className="icon-wrapper-sm">
                    <Send size={18} />
                  </div>
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://instagram.com/it_yaqinlar" target="_blank" rel="noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-3">
                  <div className="icon-wrapper-sm">
                    <Camera size={18} />
                  </div>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-400/15 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} IT Yaqinlar. Barcha huquqlar himoyalangan.</p>
          <p className="mt-1">Asoschisi: <span className="text-green-400">Ikromov Ozodbek</span></p>
        </div>
      </div>
    </footer>
  );
}
