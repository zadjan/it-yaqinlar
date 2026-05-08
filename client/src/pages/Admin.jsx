import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// --- Login form ---
function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.admin || {});
      } else {
        setError(data.error || "Email yoki parol noto'g'ri");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">IT Yaqinlar boshqaruv paneli</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@gmail.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parol</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="input-field"
              />
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Meetup form ---
function MeetupForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: '', date: '', venue: '', topic: '', status: 'upcoming' }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial?.id) {
        await api.put(`/meetups/${initial.id}`, form);
      } else {
        await api.post('/meetups', form);
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sarlavha *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="IT Yaqinlar #3" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sana va vaqt *</label>
          <input type="datetime-local" value={formatDate(form.date)}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Joy *</label>
          <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
            placeholder="Toshkent IT Park" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            className="input-field">
            <option value="upcoming">Kelgusi</option>
            <option value="past">O'tgan</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mavzu *</label>
        <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
          placeholder="Web dasturlash, AI, ..." required className="input-field" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Saqlanmoqda...' : (initial?.id ? 'Yangilash' : "Qo'shish")}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
          Bekor
        </button>
      </div>
    </form>
  );
}

// --- History form ---
function HistoryForm({ meetups, onSave }) {
  const [form, setForm] = useState({ meetupId: '', recap: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('meetupId', form.meetupId);
      fd.append('recap', form.recap);
      files.forEach(f => fd.append('photos', f));
      await api.post('/history', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ meetupId: '', recap: '' });
      setFiles([]);
      onSave();
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meetup *</label>
        <select value={form.meetupId} onChange={e => setForm({ ...form, meetupId: e.target.value })}
          required className="input-field">
          <option value="">Meetupni tanlang</option>
          {meetups.map(m => (
            <option key={m.id} value={m.id}>
              {m.title} — {m.status === 'upcoming' ? 'Kelgusi' : "O'tgan"}
            </option>
          ))}
        </select>
        {meetups.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">Meetuplar yo'q</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Qisqa bayoni *</label>
        <textarea value={form.recap} onChange={e => setForm({ ...form, recap: e.target.value })}
          placeholder="Meetup haqida qisqa tavsif..." rows={4} required className="input-field resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rasmlar</label>
        <input type="file" multiple accept="image/*"
          onChange={e => setFiles(Array.from(e.target.files))}
          className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-400 file:text-black file:font-medium file:cursor-pointer hover:file:bg-green-500" />
        {files.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{files.length} ta rasm tanlandi</p>
        )}
      </div>
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? 'Saqlanmoqda...' : "Tarix qo'shish"}
      </button>
    </form>
  );
}

// --- Main Admin ---
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState('meetups');
  const [meetups, setMeetups] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [editMeetup, setEditMeetup] = useState(null);
  const [showMeetupForm, setShowMeetupForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [histories, setHistories] = useState([]);
  const [editingHistory, setEditingHistory] = useState(null);
  const [editForm, setEditForm] = useState({ recap: '', newFiles: [] });

  const toggleGroup = (id) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      api.get('/admin/me').then(r => setAdmin(r.data)).catch(() => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
      });
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, r, h] = await Promise.all([
        api.get('/meetups'),
        api.get('/registrations'),
        api.get('/history'),
      ]);
      setMeetups(m.data);
      setRegistrations(r.data);
      setHistories(h.data);
    } catch {}
    setLoading(false);
  };

  const deleteMeetup = async (id) => {
    if (!confirm("Meetupni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/meetups/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik');
    }
  };

  const deleteRegistration = async (id) => {
    if (!confirm("Ro'yxatdanosishni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/registrations/${id}`);
      fetchAll();
    } catch {}
  };

  const handleEditHistory = (history) => {
    setEditingHistory(history);
    setEditForm({ recap: history.recap, newFiles: [] });
  };

  const handleSaveHistory = async () => {
    try {
      const fd = new FormData();
      fd.append('recap', editForm.recap);
      editForm.newFiles.forEach(f => fd.append('photos', f));
      await api.put(`/history/${editingHistory.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditingHistory(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <LoginForm onLogin={(adminData) => { setAdmin(adminData); setIsLoggedIn(true); }} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{admin?.email}</p>
        </div>
        <button onClick={logout}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-all">
          Chiqish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jami meetup', value: meetups.length, icon: '🗓️' },
          { label: 'Kelgusi', value: meetups.filter(m => m.status === 'upcoming').length, icon: '⏳' },
          { label: "Ro'yxatlar", value: registrations.length, icon: '👥' },
          { label: "O'tgan", value: meetups.filter(m => m.status === 'past').length, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-green-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-md w-fit">
        {[
          { id: 'meetups', label: 'Meetuplar' },
          { id: 'registrations', label: "Ro'yxatlar" },
          { id: 'history', label: 'Tarix' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-green-400 text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Meetups tab */}
      {tab === 'meetups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Meetuplar</h2>
            <button onClick={() => { setShowMeetupForm(!showMeetupForm); setEditMeetup(null); }}
              className="btn-primary text-sm px-4 py-2">
              {showMeetupForm ? 'Bekor' : "+ Yangi meetup"}
            </button>
          </div>

          {showMeetupForm && !editMeetup && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Yangi meetup</h3>
              <MeetupForm onSave={() => { setShowMeetupForm(false); fetchAll(); }} onCancel={() => setShowMeetupForm(false)} />
            </div>
          )}

          {editMeetup && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Meetupni tahrirlash</h3>
              <MeetupForm initial={editMeetup} onSave={() => { setEditMeetup(null); fetchAll(); }} onCancel={() => setEditMeetup(null)} />
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              <div className="card animate-pulse h-24" />
            ) : meetups.length === 0 ? (
              <div className="card text-center py-12 text-gray-500">Meetuplar yo'q</div>
            ) : meetups.map(m => (
              <div key={m.id} className="card flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{m.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      m.status === 'upcoming'
                        ? 'bg-green-400/10 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {m.status === 'upcoming' ? 'Kelgusi' : "O'tgan"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>📅 {new Date(m.date).toLocaleDateString('uz-UZ')}</span>
                    <span>📍 {m.venue}</span>
                    <span>💡 {m.topic}</span>
                    <span>👥 {m._count?.registrations || 0} ta ro'yxat</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditMeetup(m); setShowMeetupForm(false); }}
                    className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    Tahrir
                  </button>
                  <button onClick={() => deleteMeetup(m.id)}
                    className="px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrations tab */}
      {tab === 'registrations' && (() => {
        const grouped = registrations.reduce((acc, r) => {
          const key = r.meetupId;
          if (!acc[key]) acc[key] = { meetup: r.meetup, id: key, items: [] };
          acc[key].items.push(r);
          return acc;
        }, {});
        const groups = Object.values(grouped);

        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Ro'yxatdan o'tganlar ({registrations.length})
            </h2>
            {groups.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                Hali hech kim ro'yxatdan o'tmagan
              </div>
            ) : groups.map(({ id, meetup, items }) => {
              const isCollapsed = collapsedGroups.has(id);
              const dateStr = meetup?.date
                ? new Date(meetup.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })
                : '';
              return (
                <div key={id} className="card overflow-hidden p-0">
                  <button
                    onClick={() => toggleGroup(id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        🗓 {meetup?.title || 'Noma\'lum meetup'}
                      </span>
                      {dateStr && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">— {dateStr}</span>
                      )}
                      <span className="ml-3 text-xs bg-green-400/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Jami: {items.length} kishi
                      </span>
                    </div>
                    <span className={`text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}>
                      ▼
                    </span>
                  </button>

                  {!isCollapsed && (
                    <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                      {items.map((r, idx) => (
                        <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs text-gray-400 font-mono w-5 shrink-0">{idx + 1}.</span>
                            <span className="font-medium text-gray-900 dark:text-white truncate">{r.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{r.contact}</span>
                          </div>
                          <button
                            onClick={() => deleteRegistration(r.id)}
                            className="text-red-500 hover:text-red-600 text-xs shrink-0 ml-4"
                          >
                            O'chirish
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* History tab */}
      {tab === 'history' && (
        <div className="space-y-6">
          {/* Tahrirlash formasi */}
          {editingHistory && (
            <div className="card border-green-400/40">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Tarixni tahrirlash: <span className="text-green-400">{editingHistory.meetup?.title}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Qisqa bayoni</label>
                  <textarea
                    value={editForm.recap}
                    onChange={e => setEditForm({ ...editForm, recap: e.target.value })}
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Yangi rasmlar qo'shish
                    <span className="ml-1 text-xs text-gray-400">(mavjud rasmlar saqlanadi)</span>
                  </label>
                  <input
                    type="file" multiple accept="image/*"
                    onChange={e => setEditForm({ ...editForm, newFiles: Array.from(e.target.files) })}
                    className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-400 file:text-black file:font-medium file:cursor-pointer hover:file:bg-green-500"
                  />
                  {editForm.newFiles.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{editForm.newFiles.length} ta yangi rasm tanlandi</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveHistory} className="btn-primary">Saqlash</button>
                  <button
                    onClick={() => setEditingHistory(null)}
                    className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mavjud tarixlar ro'yxati */}
          {histories.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mavjud tarixlar</h2>
              {histories.map(h => (
                <div key={h.id} className="card flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{h.meetup?.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{h.recap}</p>
                    {h.photos?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">{h.photos.length} ta rasm</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEditHistory(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shrink-0"
                  >
                    <Edit size={14} />
                    Tahrirlash
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Yangi tarix qo'shish */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Yangi tarix qo'shish</h2>
            <div className="card">
              <HistoryForm meetups={meetups} onSave={fetchAll} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
