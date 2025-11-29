import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Globe } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (term: string, location: string, country: string) => void;
  isLoading: boolean;
}

const COUNTRIES = [
  "Brasil",
  "Portugal",
  "Estados Unidos",
  "Angola",
  "Moçambique",
  "Espanha",
  "Reino Unido",
  "Japão",
  "Global (Sem país específico)"
];

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('Brasil');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term, location, country);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col lg:flex-row items-center bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          
          {/* Main Search Input */}
          <div className="w-full lg:w-[40%] flex items-center border-b lg:border-b-0 lg:border-r border-slate-700 p-2">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-none text-white text-lg placeholder-slate-500 focus:ring-0 focus:outline-none py-3 px-3"
              placeholder="Nicho (ex: Pets, Finanças)..."
            />
          </div>

          {/* Country Select */}
          <div className="w-full lg:w-[25%] flex items-center border-b lg:border-b-0 lg:border-r border-slate-700 bg-slate-800/50 p-2">
             <div className="pl-4 text-slate-400">
              <Globe className="w-5 h-5 text-brand-400" />
            </div>
            <select 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-800 border-none text-white text-base focus:ring-0 focus:outline-none py-3 px-3 cursor-pointer"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div className="w-full lg:w-[20%] flex items-center bg-slate-800/50 p-2">
            <div className="pl-4 text-slate-400">
              <MapPin className="w-5 h-5 text-pink-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-none text-white text-base placeholder-slate-500 focus:ring-0 focus:outline-none py-3 px-3"
              placeholder="Cidade/Estado (Op)"
            />
          </div>

          <div className="p-2 w-full lg:w-[15%]">
            <button
              type="submit"
              disabled={isLoading || !term.trim()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white transition-all duration-200
                ${isLoading || !term.trim() 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 shadow-lg hover:shadow-brand-500/25 active:scale-95'
                }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Gerar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};