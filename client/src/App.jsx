import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Meetups from './pages/Meetups';
import History from './pages/History';
import Founder from './pages/Founder';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import CursorDot from './components/CursorDot';
import MatrixBackground from './components/MatrixBackground';

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <HelmetProvider>
    <BrowserRouter>
      <MatrixBackground dark={dark} />
      <div className="relative z-[1] min-h-screen flex flex-col bg-[#f0f0f0]/80 dark:bg-[#0a0a0a]/80 text-gray-900 dark:text-white transition-colors duration-300">
        {dark
          ? <CursorDot />
          : <div className="fixed top-0 left-0 right-0 z-50 road-bg opacity-60" />
        }
        <Navbar dark={dark} setDark={setDark} />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meetups" element={<Meetups />} />
            <Route path="/history" element={<History />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ozodbek-secret-panel" element={<Admin />} />
            <Route path="/admin" element={<Navigate to="/404" />} />
            <Route path="/404" element={
              <div style={{textAlign:'center', padding:'100px', color:'#4ade80'}}>
                <h1>404</h1>
                <p>Sahifa topilmadi</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </HelmetProvider>
  );
}
