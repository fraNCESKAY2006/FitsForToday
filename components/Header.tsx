import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-gold-600 border-b border-gold-600" : "text-stone-600 hover:text-stone-900";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">FitForToday</span>
              <span className="w-2 h-2 bg-gold-500 rounded-full mt-1"></span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 font-sans text-sm font-medium tracking-wide uppercase">
            <Link to="/" className={`pb-1 transition-colors ${isActive('/')}`}>Stylist</Link>
            <Link to="/saved" className={`pb-1 transition-colors ${isActive('/saved')}`}>Saved Looks</Link>
          </nav>
          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            <Link to="/saved" className="text-stone-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};