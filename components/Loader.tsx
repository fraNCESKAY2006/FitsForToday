import React from 'react';

export const Loader: React.FC<{ message?: string }> = ({ message = "Curating your look..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-gold-500 rounded-full animate-spin mb-4"></div>
      <p className="font-serif text-xl text-stone-600 italic animate-pulse">{message}</p>
    </div>
  );
};