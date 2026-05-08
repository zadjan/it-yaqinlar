import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import MeetupCard from '../components/MeetupCard';
import RegisterModal from '../components/RegisterModal';

export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetup, setSelectedMeetup] = useState(null);

  useEffect(() => {
    axios.get('/api/meetups')
      .then(res => setMeetups(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = meetups.filter(m => m.status === 'upcoming');
  const past = meetups.filter(m => m.status === 'past');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>Meetuplar — IT Yaqinlar</title>
        <meta name="description" content="IT Yaqinlar meetuplari — bilim almashish va networking uchrashuvlari O'zbekistonda." />
      </Helmet>
      <div className="mb-12 animate-slide-up">
        <h1 className="section-title">Meetuplar</h1>
        <p className="section-subtitle">
          Kelgusi va o'tgan meetuplar — bilim almashish, yangi tanishlar
        </p>
      </div>

      {/* Upcoming */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kelgusi meetuplar</h2>
          <span className="bg-green-400/10 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
            {upcoming.length}
          </span>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card h-64 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="card text-center py-16">
            <div className="icon-wrapper mx-auto mb-4">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Hozircha rejalashtirilgan meetup yo'q
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Telegram kanalimizni kuzatib boring — tez orada e'lon qilamiz!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(m => (
              <MeetupCard key={m.id} meetup={m} onRegister={setSelectedMeetup} />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 bg-gray-400 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">O'tgan meetuplar</h2>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
              {past.length}
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map(m => (
              <MeetupCard key={m.id} meetup={m} />
            ))}
          </div>
        </section>
      )}

      {selectedMeetup && (
        <RegisterModal meetup={selectedMeetup} onClose={() => setSelectedMeetup(null)} />
      )}
    </div>
  );
}
