import { Calendar, MapPin, Tag } from 'lucide-react';

export default function MeetupCard({ meetup, onRegister }) {
  const date = new Date(meetup.date);
  const isPast = meetup.status === 'past';

  return (
    <div className={`card relative overflow-hidden group ${isPast ? 'opacity-80' : ''}`}>
      {!isPast && (
        <span className="absolute top-4 right-4 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          Kelgusi
        </span>
      )}
      {isPast && (
        <span className="absolute top-4 right-4 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full">
          O'tgan
        </span>
      )}

      <div className="mb-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
          <div className="icon-wrapper-sm">
            <Calendar size={16} />
          </div>
          <span>
            {date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' — '}
            {date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="icon-wrapper-sm">
            <MapPin size={16} />
          </div>
          <span>{meetup.venue}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-400 transition-colors">
        {meetup.title}
      </h3>

      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-5">
        <div className="icon-wrapper-sm mt-0.5">
          <Tag size={16} />
        </div>
        <span className="line-clamp-2">{meetup.topic}</span>
      </div>

      {!isPast && (
        <button
          onClick={() => onRegister && onRegister(meetup)}
          className="btn-primary w-full text-center"
        >
          Ro'yxatdan o'tish
        </button>
      )}
    </div>
  );
}
