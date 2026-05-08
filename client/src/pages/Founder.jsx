import { Helmet } from 'react-helmet-async';
import { Lightbulb, Target, Globe, TrendingUp, Users, Heart,
         Send, Camera } from 'lucide-react';

export default function Founder() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Asoschimiz — IT Yaqinlar</title>
        <meta name="description" content="Ikromov Ozodbek — IT Yaqinlar hamjamiyati asoschisi." />
      </Helmet>
      <div className="animate-slide-up">

        {/* Profile */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
          <div className="shrink-0">
            <div className="founder-image-wrapper">
              <img
                src="/asoschi.png"
                alt="Ikromov Ozodbek"
                className="founder-image"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-400/10 dark:bg-green-400/20 border border-green-400/30 rounded-full px-4 py-1.5 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              Asoschisi
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Ikromov Ozodbek
            </h1>
            <p className="text-green-400 font-medium text-lg mb-4">
              IT Yaqinlar hamjamiyati asoschisi
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              Frontend dasturchi va IT hamjamiyat tashkilotchisi.
              Yoshlarga IT sohasini yaqinlashtirish va bilim ulashish
              maqsadida IT Yaqinlar hamjamiyatini tashkil etdi.
            </p>

            <div className="flex flex-wrap gap-2 mt-5 justify-center md:justify-start">
              {['React', 'JavaScript', 'HTML & CSS', 'Tailwind CSS'].map(skill => (
                <span
                  key={skill}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          {/* Nima uchun */}
          <div className="card border-l-4 border-l-green-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-wrapper !p-2">
                <Lightbulb size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Nima uchun IT Yaqinlar?
              </h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
              <p>
                IT sohasiga kirishmoqchi bo'lganlar yoki allaqachon shu sohada ishlaydigan
                mutaxassislar uchun munosib, sifatli va qulay muhit yaratishni xohladim.
                Ko'p yillar davomida men o'zim ham yangi narsalar o'rganishda hamjamiyatning
                kuchini his qilganman.
              </p>
              <p>
                Uzbekistonda IT sohasida ko'plab iste'dodli yoshlar bor, lekin ularning
                ko'pchiligi tarqoq ishlaydi. IT Yaqinlar bu iste'dodlarni bir joyga to'plash,
                bilim almashish va birgalikda o'sish uchun platforma yaratdi.
              </p>
            </div>
          </div>

          {/* Maqsad */}
          <div className="card border-l-4 border-l-green-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-wrapper !p-2">
                <Target size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Maqsad
              </h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
              <p>
                Asosiy maqsadimiz — O‘zbekistonda kuchli va o‘zaro bog‘liq IT hamjamiyatini shakllantirish. Har bir meetupda ishtirokchilar nafaqat bilim oladi, balki yangi do‘stlar va hamkorlar topadi.
              </p>
              <p>
                Uzoq muddatli maqsad: IT Yaqinlarni O‘zbekistonning eng yirik va faol IT hamjamiyatlaridan biriga aylantirish, keyinchalik boshqa shaharlarda ham faoliyatini kengaytirish.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { Icon: Globe, label: "Ko'lam", value: "O'zbekiston" },
                { Icon: TrendingUp, label: "O'sish", value: 'Har oy' },
                { Icon: Users, label: 'Hamkorlik', value: 'Ochiq' },
                { Icon: Heart, label: 'Ruh', value: 'IT Yaqinlar' },
              ].map(({ Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="icon-wrapper-sm">
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div className="card bg-gradient-to-br from-green-400/5 to-transparent border-green-400/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
               Asoschimiz bilan muloqot
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/Ikromov_fn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 px-4 py-2.5 rounded-md font-medium transition-all duration-200 text-sm"
              >
                <div className="icon-wrapper !p-2">
                  <Send size={20} />
                </div>
                Telegram
              </a>
              <a
                href="https://instagram.com/ikromovblog"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 px-4 py-2.5 rounded-md font-medium transition-all duration-200 text-sm"
              >
                <div className="icon-wrapper !p-2">
                  <Camera size={20} />
                </div>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
