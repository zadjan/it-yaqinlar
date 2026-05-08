import { Helmet } from 'react-helmet-async';
import { Send, Camera } from 'lucide-react';

const socials = [
  {
    name: 'Telegram',
    handle: '@IT_yaqinlar',
    href: 'https://t.me/IT_yaqinlar',
    Icon: Send,
    badge: 'Asosiy kanal',
  },
  {
    name: 'Instagram',
    handle: '@it_yaqinlar',
    href: 'https://instagram.com/it_yaqinlar',
    Icon: Camera,
    badge: 'Suratlar',
  },
];

const cardStyle = {
  background: 'rgba(10, 20, 10, 0.6)',
  border: '1px solid rgba(74, 222, 128, 0.3)',
  borderRadius: '12px',
  transition: 'border-color 0.2s, transform 0.2s',
};

const cardHoverStyle = {
  borderColor: 'rgba(74, 222, 128, 0.6)',
  transform: 'translateY(-4px)',
};

const iconWrapperStyle = {
  background: 'rgba(74, 222, 128, 0.1)',
  borderRadius: '12px',
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#4ade80',
};

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Helmet>
        <title>Aloqa — IT Yaqinlar</title>
        <meta name="description" content="IT Yaqinlar bilan bog'laning — Telegram va Instagram." />
      </Helmet>
      <div className="mb-12 animate-slide-up">
        <h1 className="section-title">Aloqa</h1>
        <p className="section-subtitle">
          Savollaringiz bo'lsa, ijtimoiy tarmoqlar orqali bog'laning
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
        {socials.map(({ name, handle, href, Icon, badge }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={cardStyle}
            className="group flex flex-col items-center text-center gap-4 py-12 px-8"
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, {
              borderColor: 'rgba(74, 222, 128, 0.3)',
              transform: 'translateY(0)',
            })}
          >
            <div style={iconWrapperStyle} className="transition-transform duration-200 group-hover:scale-110">
              <Icon size={36} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: '#4ade80' }}>{badge}</div>
              <div className="font-bold text-xl" style={{ color: '#ffffff' }}>{name}</div>
              <div className="text-sm mt-1" style={{ color: '#ffffff', opacity: 0.8 }}>{handle}</div>
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#4ade80' }}>
              Kuzatish →
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
