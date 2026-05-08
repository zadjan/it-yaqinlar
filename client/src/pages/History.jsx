import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar } from 'lucide-react';
import axios from 'axios';

function Lightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);

  const prev = () => setCurrent(c => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent(c => (c + 1) % photos.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-green-400 transition-colors text-2xl font-bold z-10"
      >
        ✕
      </button>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-green-400 text-white hover:text-black p-3 rounded-full transition-all duration-200"
      >
        ‹
      </button>

      <img
        src={photos[current]}
        alt={`Rasm ${current + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-md shadow-2xl"
      />

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-green-400 text-white hover:text-black p-3 rounded-full transition-all duration-200"
      >
        ›
      </button>

      <div className="absolute bottom-4 text-white/70 text-sm">
        {current + 1} / {photos.length}
      </div>
    </div>
  );
}

export default function History() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios.get('/api/history')
      .then(res => setHistories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>Tarix — IT Yaqinlar</title>
        <meta name="description" content="IT Yaqinlar o'tgan meetuplari tarixi va esdaliklar." />
      </Helmet>
      <div className="mb-12 animate-slide-up">
        <h1 className="section-title">Meetuplar tarixi</h1>
        <p className="section-subtitle">
          O'tgan meetuplarning xotiralari — suratlar va qisqa bayonlar
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-6" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : histories.length === 0 ? (
        <div className="card text-center py-20">
          <div className="icon-wrapper mx-auto mb-4">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Hali tarix yo'q
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Birinchi meetup o'tgandan keyin shu yerda ko'rinadi
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {histories.map(h => (
            <div key={h.id} className="card group">
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar size={14} />
                {new Date(h.meetup.date).toLocaleDateString('uz-UZ', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-400 transition-colors">
                {h.meetup.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Mavzu: {h.meetup.topic}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {h.recap}
              </p>

              {h.photos && h.photos.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Suratlar ({h.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {h.photos.slice(0, 6).map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightbox({ photos: h.photos, index: idx })}
                        className="relative aspect-square overflow-hidden rounded-md hover:ring-2 hover:ring-green-400 transition-all duration-200 group/img"
                      >
                        <img
                          src={photo}
                          alt={`Surat ${idx + 1}`}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                        />
                        {idx === 5 && h.photos.length > 6 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                            +{h.photos.length - 6}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
