import { useState } from 'react';
import axios from 'axios';

export default function RegisterModal({ meetup, onClose }) {
  const [form, setForm] = useState({ name: '', contact: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await axios.post('/api/registrations', {
        name: form.name,
        contact: form.contact,
        meetupId: meetup.id,
      });
      setSuccess(true);
    } catch (err) {
      const message = err.response?.data?.error || 'Xatolik yuz berdi';
      if (message.includes('allaqachon')) {
        setInfo("Siz allaqachon bu meetupga ro'yxatdan o'tgansiz! 🎉");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#ebebeb] dark:bg-[#111] rounded-md shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ro'yxatdan o'tish</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{meetup.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Muvaffaqiyatli ro'yxatdan o'tdingiz!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Tabriklaymiz! Emailingizga tasdiqlash xati yuborildi 📧
              </p>
              <button onClick={onClose} className="btn-primary">
                Yopish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Ism Familiya *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ikromov Ozodbek"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="example@gmail.com"
                  required
                  className="input-field"
                />
              </div>

              {info && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-md text-sm">
                  {info}
                </div>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Yuborilmoqda...
                    </span>
                  ) : (
                    "Ro'yxatdan o'tish"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
