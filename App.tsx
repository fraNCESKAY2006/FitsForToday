import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { SavedOutfits } from './pages/SavedOutfits';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen font-sans text-stone-900 antialiased selection:bg-gold-400 selection:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<SavedOutfits />} />
          </Routes>
        </main>
        <footer className="bg-stone-900 text-stone-500 py-12 text-center text-sm">
          <p>© {new Date().getFullYear()} FitForToday. All rights reserved.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;