import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Target, Users, Lightbulb, TrendingUp, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import RegisterModal from '../components/RegisterModal';

export default function Home() {
  const [nextMeetup, setNextMeetup] = useState(null);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ meetuplar: 0, ishtirokchilar: 0, otgan: 0 });

  useEffect(() => {
    axios.get('/api/meetups?status=upcoming')
      .then(res => {
        if (res.data.length > 0) setNextMeetup(res.data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    axios.get('/api/stats')
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>IT Yaqinlar — IT Hamjamiyati</title>
        <meta name="description" content="IT Yaqinlar — O'zbekistondagi IT hamjamiyati. Meetuplar, bilim almashish, networking O'zbekistonda." />
      </Helmet>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-green-400/10 dark:via-transparent dark:to-green-400/5" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-slide-up text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-400/10 dark:bg-green-400/20 border border-green-400/30 rounded-full px-4 py-1.5 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              IT hamjamiyati
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              IT{' '}
              <span className="text-green-400 relative">
                Yaqinlar
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-green-400/30 rounded-full" />
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              IT sohasida yaqin bo'lamiz — bilim almashish, tajriba ulashish va birgalikda o'sish uchun.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/meetups">
                <button className="btn-primary text-base">
                  Meetuplarga qatnashing →
                </button>
              </Link>
              <Link
                to="/history"
                className="px-6 py-3 rounded-md border-2 border-green-400 text-green-600 dark:text-green-400 font-semibold hover:bg-green-400 hover:text-black dark:hover:text-black transition-all duration-200"
              >
                Tarixni ko'rish
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center md:justify-start">
              {[
                { label: 'Meetuplar', value: stats.meetuplar },
                { label: 'Ishtirokchilar', value: stats.ishtirokchilar },
                { label: "O'tkazilgan meetuplar", value: stats.otgan },
              ].map(s => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="text-2xl font-bold text-green-400">{s.value}+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — next meetup card */}
          <div className="animate-fade-in">
            {loading ? (
              <div className="card h-64 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
              </div>
            ) : nextMeetup ? (
              <div className="card border-green-400/30 hover:border-green-400/60 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Keyingi meetup
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {nextMeetup.title}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Calendar size={14} className="text-green-400 shrink-0" />
                    {new Date(nextMeetup.date).toLocaleDateString('uz-UZ', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Clock size={14} className="text-green-400 shrink-0" />
                    {new Date(nextMeetup.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin size={14} className="text-green-400 shrink-0" />
                    {nextMeetup.venue}
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Lightbulb size={14} className="text-green-400 shrink-0 mt-0.5" />
                    <span>{nextMeetup.topic}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMeetup(nextMeetup)}
                  className="btn-primary w-full"
                >
                  Ro'yxatdan o'tish
                </button>
              </div>
            ) : (
              <div className="card text-center py-12 bg-white/50 backdrop-blur-sm">
                <div className="icon-wrapper mx-auto mb-4">
                  <Calendar size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tez kunda yangi meetup
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Kuzatib boring!
                </p>
              </div>
            )}

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { Icon: Target, title: 'Amaliy', desc: 'Real loyihalar' },
                { Icon: Users, title: 'Networking', desc: 'Yangi tanishlar' },
                { Icon: Lightbulb, title: "Ko'nikmalar", desc: 'Bilim almashish' },
                { Icon: TrendingUp, title: 'Karyera', desc: "O'sish yo'li" },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="bg-white/50 backdrop-blur-sm glass rounded-md p-3 flex items-center gap-3 transition-all duration-300 dark:hover:-translate-y-1">
                  <div className="icon-wrapper !p-2">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="section-bg py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="section-title">Nima uchun IT Yaqinlar?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Biz IT sohasida ishlovchi va o'rganayotgan barcha uchun ochiq hamjamiyatmiz
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Users,
                title: 'Hamjamiyat',
                desc: "Bir-birini qo'llab-quvvatlaydigan, bilim ulashadigan IT mutaxassislari jamoasi.",
              },
              {
                Icon: BookOpen,
                title: 'Ta\'lim',
                desc: "Har meetupda yangi mavzular, amaliy mashg'ulotlar va tajribali mutaxassislar bilan suhbat.",
              },
              {
                Icon: TrendingUp,
                title: "O'sish",
                desc: "Karyerangizni rivojlantirish, yangi imkoniyatlar topish va professional tarmoq qurishga yordam.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="card text-center group bg-white/50 backdrop-blur-sm">
                <div className="icon-wrapper mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Birgalikda o'samiz!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            IT Yaqinlar hamjamiyatiga qo'shiling va IT dunyosida yangi bosqichga chiqing
          </p>
          <Link to="/meetups">
            <button className="btn-primary text-lg px-8 py-4">
              Meetuplarga qatnashing
            </button>
          </Link>
        </div>
      </section>

      {selectedMeetup && (
        <RegisterModal meetup={selectedMeetup} onClose={() => setSelectedMeetup(null)} />
      )}
    </div>
  );
}
