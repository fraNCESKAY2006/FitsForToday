import React from 'react';
import { OutfitRecommendation } from '../types';
import { Button } from './Button';

interface OutfitCardProps {
  outfit: OutfitRecommendation;
  onSave?: () => void;
  isSaved?: boolean;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onSave, isSaved }) => {
  return (
    <div className="bg-white shadow-xl shadow-stone-200/50 overflow-hidden flex flex-col lg:flex-row animate-fade-in border border-stone-100">
      
      {/* Image Section */}
      <div className="w-full lg:w-1/2 bg-stone-100 relative min-h-[400px] lg:min-h-[600px]">
        {outfit.imageUrl ? (
          <img 
            src={outfit.imageUrl} 
            alt={outfit.title} 
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 font-serif italic">
            Image generation unavailable
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-900">
          {outfit.occasion} • {outfit.gender}
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div>
                 <h2 className="font-serif text-3xl text-stone-900 mb-2">{outfit.title}</h2>
                 <p className="text-stone-500 font-sans italic">{outfit.weather.temperature}°C, {outfit.weather.condition}</p>
            </div>
            {onSave && (
                <button 
                    onClick={onSave}
                    disabled={isSaved}
                    className={`p-2 rounded-full border transition-all ${isSaved ? 'bg-gold-500 border-gold-500 text-white' : 'border-stone-200 text-stone-400 hover:border-gold-500 hover:text-gold-500'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                </button>
            )}
        </div>

        <p className="text-stone-600 mb-8 leading-relaxed font-light">{outfit.description}</p>

        <div className="space-y-8 flex-grow">
          {/* Key Pieces */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-gold-600 mb-3">Key Pieces</h3>
            <ul className="space-y-2">
              {outfit.items.map((item, idx) => (
                <li key={idx} className="flex items-center text-stone-800">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-gold-600 mb-3">Palette</h3>
            <div className="flex gap-3">
              {outfit.colorPalette.map((color, idx) => (
                <div key={idx} className="group relative">
                    <div 
                        className="w-8 h-8 rounded-full border border-stone-200 shadow-sm"
                        style={{ backgroundColor: color.includes('#') ? color : '#e7e5e4' }} // Fallback color if name
                        title={color}
                    ></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-stone-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {color}
                    </span>
                </div>
              ))}
            </div>
          </div>

           {/* Styling Tips */}
           <div className="bg-stone-50 p-6 border-l-2 border-gold-500">
             <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-gold-600 mb-2">Stylist Notes</h3>
             <ul className="space-y-2 text-sm text-stone-700">
                {outfit.stylingTips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                ))}
             </ul>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
            <span>Powered by Gemini</span>
            <span>{new Date(outfit.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};