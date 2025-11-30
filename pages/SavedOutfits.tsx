import React, { useEffect, useState } from 'react';
import { OutfitRecommendation } from '../types';
import { Link } from 'react-router-dom';

export const SavedOutfits: React.FC = () => {
  const [saved, setSaved] = useState<OutfitRecommendation[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('fitfortoday_saved');
    if (data) {
      setSaved(JSON.parse(data));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('fitfortoday_saved');
    setSaved([]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl text-stone-900">Wardrobe Archive</h1>
          {saved.length > 0 && (
             <button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-600 underline">
               Clear All
             </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg mb-6">No saved looks yet.</p>
            <Link to="/" className="text-gold-600 hover:text-gold-700 font-bold uppercase tracking-widest text-sm border-b border-gold-600 pb-1">
              Create your first look
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saved.map((outfit) => (
              <div key={outfit.id} className="bg-white group hover:shadow-xl transition-shadow duration-300 border border-stone-100 flex flex-col">
                <div className="h-64 overflow-hidden relative bg-stone-200">
                    {outfit.imageUrl && <img src={outfit.imageUrl} alt={outfit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        {outfit.occasion}
                    </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-xl font-bold text-stone-900">{outfit.title}</h3>
                        <span className="text-xs text-stone-400">{new Date(outfit.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-stone-500 mb-4 line-clamp-2">{outfit.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-stone-100">
                        <h4 className="text-xs uppercase font-bold text-gold-600 mb-2">Key Items</h4>
                        <p className="text-xs text-stone-600">{outfit.items.slice(0, 3).join(', ')}...</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};