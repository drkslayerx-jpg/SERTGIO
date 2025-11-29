import React from 'react';
import { Youtube, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center mb-4">
        <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-900/20 transform -rotate-6">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <div className="ml-4 bg-brand-600 p-3 rounded-2xl shadow-lg shadow-brand-900/20 transform rotate-3">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
        Descubra Seu Próximo <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-500">Nicho de Ouro</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
        Use a inteligência artificial para encontrar sub-nichos inexplorados, com baixa competição e alto potencial de viralização no YouTube.
      </p>
    </div>
  );
};