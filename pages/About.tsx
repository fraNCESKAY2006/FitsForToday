import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-serif text-4xl text-stone-900 mb-6">About FitForToday</h1>
        <p className="text-stone-600 leading-relaxed mb-6 font-light text-lg">
          FitForToday bridges the gap between functional utility and high-end fashion. 
          By combining real-time meteorological data with advanced Generative AI, we provide 
          outfit recommendations that are not only practical for the weather but tailored 
          to your specific social occasions.
        </p>
        <p className="text-stone-600 leading-relaxed mb-12 font-light text-lg">
          Our mission is to eliminate decision fatigue and help you look your best, effortlessly.
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-left border-t border-stone-200 pt-8">
            <div>
                <h3 className="font-bold text-stone-900 mb-1">Contact</h3>
                <p className="text-stone-500">hello@fitfortoday.com</p>
            </div>
            <div>
                <h3 className="font-bold text-stone-900 mb-1">Version</h3>
                <p className="text-stone-500">1.0.0 (Beta)</p>
            </div>
        </div>
      </div>
    </div>
  );
};