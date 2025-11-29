import React, { useState } from 'react';
import { SubNiche } from '../types';
import { Users, DollarSign, Target, Lightbulb, TrendingUp, Copy, Check, FileText, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface NicheCardProps {
  niche: SubNiche;
  index: number;
}

export const NicheCard: React.FC<NicheCardProps> = ({ niche, index }) => {
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Baixa' || level === 'Muito Alta') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (level === 'Média') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const handleCopy = () => {
    const text = `
Sub-Nicho: ${niche.title}
Descrição: ${niche.description}
Ideias:
${niche.videoIdeas.map(i => `- ${i}`).join('\n')}

ROTEIRO SUGERIDO:
${niche.scriptOutline}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-brand-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/20 flex flex-col h-full group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-all"></div>

      <div className="mb-6 relative">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-white leading-tight pr-4">{niche.title}</h3>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Copiar tudo (incluindo roteiro)"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300 text-sm font-mono border border-slate-600">
                  #{index + 1}
              </span>
            </div>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
             <ShieldCheck className="w-4 h-4 text-green-400" />
             <span className="text-xs font-medium text-green-400 uppercase tracking-wide">AdSense Safe (Sem Strikes)</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{niche.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Competição</span>
          </div>
          <div className={`text-sm font-semibold px-2 py-0.5 rounded-md inline-block border ${getLevelColor(niche.competitionLevel)}`}>
            {niche.competitionLevel}
          </div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Users className="w-3 h-3" />
            <span>Demanda</span>
          </div>
          <div className={`text-sm font-semibold px-2 py-0.5 rounded-md inline-block border ${getLevelColor(niche.demandLevel)}`}>
            {niche.demandLevel}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
                <DollarSign className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-medium">Potencial de Monetização</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold">
                <span className={getScoreColor(niche.monetizationScore)}>{niche.monetizationScore}</span>
                <span className="text-slate-600">/10</span>
            </div>
         </div>
         <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div 
                className="bg-gradient-to-r from-brand-500 to-pink-500 h-1.5 rounded-full" 
                style={{ width: `${niche.monetizationScore * 10}%` }}
            ></div>
         </div>
      </div>

      <div className="space-y-4 mb-6 flex-grow">
        <div>
            <div className="flex items-center gap-2 text-brand-300 mb-2">
                <Target className="w-4 h-4" />
                <h4 className="text-sm font-semibold uppercase tracking-wider">Por que é forte?</h4>
            </div>
            <p className="text-slate-300 text-sm bg-brand-900/20 p-3 rounded-lg border border-brand-500/20">
                {niche.growthPotential}
            </p>
        </div>

        <div>
             <div className="flex items-center gap-2 text-yellow-300 mb-2">
                <Lightbulb className="w-4 h-4" />
                <h4 className="text-sm font-semibold uppercase tracking-wider">Ideias de Vídeo</h4>
            </div>
            <ul className="space-y-2">
                {niche.videoIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-yellow-500 flex-shrink-0"></span>
                        <span className="font-medium text-slate-300">{idea}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Script Section */}
      <div className="border-t border-slate-700 pt-4 mt-auto">
        <button 
            onClick={() => setShowScript(!showScript)}
            className="w-full flex items-center justify-between px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Roteiro Sugerido</span>
            </div>
            {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showScript && (
            <div className="mt-3 p-4 bg-slate-900 rounded-lg border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap animate-fade-in">
                <div className="font-bold text-brand-400 mb-2 text-xs uppercase tracking-wider">Estrutura para Vídeo #1</div>
                {niche.scriptOutline}
            </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Público:</span> {niche.targetAudience}
        </div>
      </div>
    </div>
  );
};