import React, { useState, useEffect } from 'react';
import { Occasion, Gender, WeatherData, OutfitRecommendation } from '../types';
import { OCCASIONS, GENDERS } from '../constants';
import { fetchWeather } from '../services/weatherService';
import { generateOutfitDetails, generateOutfitImage } from '../services/geminiService';
import { Button } from '../components/Button';
import { Loader } from '../components/Loader';
import { OutfitCard } from '../components/OutfitCard';

export const Home: React.FC = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  
  // Form State
  const [occasion, setOccasion] = useState<Occasion>(Occasion.CASUAL);
  const [gender, setGender] = useState<Gender>(Gender.UNISEX);
  const [locationInput, setLocationInput] = useState<string>('');
  const [manualWeather, setManualWeather] = useState(false); // If we wanted manual input mode

  // Saved logic
  const [isSaved, setIsSaved] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const w = await fetchWeather(position.coords.latitude, position.coords.longitude);
            // Don't overwrite if user typed something specific, but for "Get Location" we assume they want GPS info
            // locationInput is just a string, fetchWeather returns a generic location name or coords
            // For better UX, we just set the prompt to use this data, but here we update the input to show feedback
            setLocationInput(`${w.locationName}`); 
            setLoading(false);
          } catch (err) {
            setError("Could not fetch weather for this location.");
            setLoading(false);
          }
        },
        (err) => {
          setError("Geolocation permission denied. Please enter manually.");
          setLoading(false);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutfit(null);
    setIsSaved(false);

    try {
      // 1. Get Weather (Simulating location if not already fetched, or using a default for demo)
      // In a real app, we would Geocode the 'locationInput' text string to lat/lon.
      // Here, we'll just use a default lat/lon (London) if user types something, or use browser loc.
      let weather: WeatherData;
      
      // Simulating a fetch for the demo if user typed something but didn't use GPS button
      weather = await fetchWeather(51.50, -0.12); 
      
      // Use the input location or fallback to "General"
      const locationContext = locationInput.trim() || "General Urban City";

      // 2. Generate Text Details
      const details = await generateOutfitDetails(weather, occasion, gender, locationContext);

      // 3. Generate Image
      let imageUrl = '';
      try {
        // We pass 'everyday-realistic' to ensure the image looks like a real person wearing real clothes
        imageUrl = await generateOutfitImage(details, weather, occasion, gender, 'everyday-realistic', locationContext);
      } catch (imgErr) {
        console.error("Image gen failed", imgErr);
        // Continue without image or with placeholder
      }

      // 4. Set State
      const newOutfit: OutfitRecommendation = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        occasion,
        gender,
        weather,
        ...details,
        imageUrl
      };

      setOutfit(newOutfit);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!outfit) return;
    const saved = localStorage.getItem('fitfortoday_saved');
    const savedList = saved ? JSON.parse(saved) : [];
    localStorage.setItem('fitfortoday_saved', JSON.stringify([outfit, ...savedList]));
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="bg-stone-900 text-stone-50 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-6 text-white">
            Elevate Your Style,<br />
            <span className="italic text-gold-500">Every Single Day.</span>
          </h1>
          <p className="text-stone-300 text-lg mb-10 max-w-xl mx-auto font-light">
            AI-curated outfit recommendations tailored to your local weather, location vibe, and occasion.
          </p>
          
          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-white p-2 rounded-lg shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
             
             {/* Occasion */}
            <select 
              className="flex-1 p-3 bg-transparent text-stone-900 font-sans border-b md:border-b-0 md:border-r border-stone-200 focus:outline-none"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
            >
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>

            {/* Gender */}
            <select 
              className="md:w-32 p-3 bg-transparent text-stone-900 font-sans border-b md:border-b-0 md:border-r border-stone-200 focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* Location */}
            <div className="flex-1 relative flex items-center border-b md:border-b-0 border-stone-200">
               <input 
                 type="text" 
                 placeholder="City or 'Use GPS'" 
                 className="w-full p-3 bg-transparent text-stone-900 focus:outline-none"
                 value={locationInput}
                 onChange={(e) => setLocationInput(e.target.value)}
               />
               <button 
                type="button" 
                onClick={handleGetLocation}
                className="p-2 text-stone-400 hover:text-gold-500"
                title="Use Current Location"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
               </button>
            </div>

            <Button type="submit" disabled={loading} className="md:rounded-md">
               {loading ? 'Styling...' : 'Get My Outfit'}
            </Button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {loading && <div className="bg-white rounded-xl p-12 shadow-xl"><Loader /></div>}
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl text-center shadow-lg">
            <p>{error}</p>
          </div>
        )}

        {!loading && outfit && (
          <OutfitCard 
            outfit={outfit} 
            onSave={handleSave} 
            isSaved={isSaved} 
          />
        )}
      </div>

      {/* Features Grid (Shown when no result) */}
      {!loading && !outfit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">☁️</div>
              <h3 className="font-serif text-xl font-bold mb-2">Weather Smart</h3>
              <p className="text-stone-500 font-light">Real-time weather integration ensures you're never underdressed or overheated.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">✨</div>
              <h3 className="font-serif text-xl font-bold mb-2">Occasion Ready</h3>
              <p className="text-stone-500 font-light">From first dates to boardroom meetings, get the perfect look for any event.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">🌍</div>
              <h3 className="font-serif text-xl font-bold mb-2">Global Style</h3>
              <p className="text-stone-500 font-light">Input your city or country to get recommendations that match the local fashion culture.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};