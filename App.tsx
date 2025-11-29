import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { SearchBox } from './components/SearchBox';
import { NicheCard } from './components/NicheCard';
import { generateSubNiches } from './services/geminiService';
import { SearchState } from './types';
import { LayoutGrid, AlertCircle, Printer, MonitorDown, Copy, Check, X, Smartphone, Monitor, Share2, Link, MessageCircle, Send, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [reportCopied, setReportCopied] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchContext, setSearchContext] = useState({ term: '', location: '', country: 'Brasil' });

  // Check if already in standalone mode
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log("Install prompt captured");
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      setShowInstallHelp(true);
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'NichoTube Finder',
      text: 'Encontre nichos virais e seguros para o YouTube com Inteligência Artificial!',
      url: window.location.href
    };

    // Try native share ONLY on mobile devices where it's robust
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('User cancelled share or error:', err);
      }
    } else {
      // On Desktop or fallback, show custom modal
      setShowShareModal(true);
    }
  };

  const handleSocialShare = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'copy') => {
    const text = encodeURIComponent('Encontre nichos virais para YouTube com IA! 👇');
    const url = encodeURIComponent(window.location.href);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleSearch = async (term: string, location: string, country: string) => {
    setState({ isLoading: true, error: null, data: null });
    setSearchContext({ term, location, country });
    try {
      const data = await generateSubNiches(term, location, country);
      setState({ isLoading: false, error: null, data });
    } catch (error: any) {
      let errorMessage = "Não foi possível gerar os nichos agora. Tente novamente.";
      
      if (error.message === "MISSING_API_KEY") {
        errorMessage = "MISSING_KEY"; // Código especial para renderizar UI de ajuda
      }

      setState({ 
        isLoading: false, 
        error: errorMessage, 
        data: null 
      });
    }
  };

  const generateReportText = () => {
    if (!state.data) return '';
    const date = new Date().toLocaleDateString('pt-BR');
    let content = `RELATÓRIO DE SUB-NICHOS - NICHOTUBE FINDER\nGerado em: ${date}\n`;
    content += `Tema: ${searchContext.term} | País: ${searchContext.country} ${searchContext.location ? `| Local: ${searchContext.location}` : ''}\n\n`;
    content += `=============================================\n\n`;

    state.data.forEach((niche, index) => {
      content += `NICHO #${index + 1}: ${niche.title.toUpperCase()}\n`;
      content += `Descrição: ${niche.description}\n`;
      content += `Competição: ${niche.competitionLevel} | Demanda: ${niche.demandLevel}\n`;
      content += `Score de Monetização: ${niche.monetizationScore}/10\n`;
      content += `Público Alvo: ${niche.targetAudience}\n`;
      content += `Análise: ${niche.growthPotential}\n`;
      content += `\nIDEIAS DE VÍDEO:\n`;
      niche.videoIdeas.forEach(idea => {
        content += `[ ] ${idea}\n`;
      });
      content += `\nROTEIRO SUGERIDO (Ideia #1):\n`;
      content += `${niche.scriptOutline}\n`;
      content += `\n---------------------------------------------\n\n`;
    });
    return content;
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const content = generateReportText();
    if (!content) return;
    navigator.clipboard.writeText(content);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] text-slate-200 font-sans selection:bg-brand-500 selection:text-white pb-10 relative">
      
      {/* HIDDEN PRINTABLE AREA */}
      <div id="printable-area" className="hidden">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Relatório NichoTube Finder</h1>
        <p style={{ marginBottom: '20px' }}>
          <strong>Tema:</strong> {searchContext.term} <br/>
          <strong>País:</strong> {searchContext.country} <br/>
          {searchContext.location && <span><strong>Localização:</strong> {searchContext.location} <br/></span>}
          <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>
        <hr style={{ marginBottom: '20px' }} />
        {state.data && state.data.map((niche, index) => (
          <div key={index} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>#{index + 1} {niche.title}</h2>
            <p><em>{niche.description}</em></p>
            <p><strong>Competição:</strong> {niche.competitionLevel} | <strong>Demanda:</strong> {niche.demandLevel} | <strong>Monetização:</strong> {niche.monetizationScore}/10</p>
            
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderLeft: '4px solid #666' }}>
              <strong>Ideias de Vídeo:</strong>
              <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                {niche.videoIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
              </ul>
            </div>
            
            <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
              <strong>Roteiro Sugerido:</strong><br/>
              {niche.scriptOutline}
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#999' }}>
           Gerado por NichoTube Finder AI
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-brand-600 to-pink-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
                <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NichoTube<span className="text-brand-400">Finder</span></span>
          </div>
          
          <div className="flex items-center gap-3">
             <button
               onClick={handleShareApp}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-bold transition-all border border-slate-700 hover:border-brand-500"
               title="Compartilhar App"
             >
                <Share2 className="w-3 h-3" />
                <span>COMPARTILHAR</span>
             </button>

             {!isInstalled && (
                <button 
                    onClick={handleInstallClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-brand-500/30 animate-pulse hover:animate-none z-50 cursor-pointer"
                >
                    <MonitorDown className="w-3 h-3" />
                    <span>INSTALAR APP</span>
                </button>
             )}
          </div>
        </nav>

        <Hero />
        
        <SearchBox onSearch={handleSearch} isLoading={state.isLoading} />

        {state.error && (
          <div className={`max-w-3xl mx-auto mb-12 p-6 rounded-xl border flex gap-4 animate-fade-in ${state.error === 'MISSING_KEY' ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-red-900/20 border-red-900/50'}`}>
            <AlertCircle className={`w-6 h-6 flex-shrink-0 ${state.error === 'MISSING_KEY' ? 'text-yellow-500' : 'text-red-400'}`} />
            <div>
              {state.error === 'MISSING_KEY' ? (
                <div className="text-yellow-100">
                  <h3 className="font-bold text-lg mb-2">Configuração Necessária (Vercel)</h3>
                  <p className="mb-4">O App está online, mas a <strong>Chave da API (API Key)</strong> não foi configurada no servidor.</p>
                  <div className="bg-black/40 p-4 rounded-lg text-sm font-mono text-slate-300">
                    <p className="mb-2 font-bold text-white">Como resolver:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Vá no painel do <strong>Vercel</strong> → Settings.</li>
                      <li>Clique em <strong>Environment Variables</strong>.</li>
                      <li>Adicione a chave: <code>API_KEY</code></li>
                      <li>Cole sua chave do Gemini no valor.</li>
                      <li>Redeploy o projeto.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-red-200 text-lg">{state.error}</p>
              )}
            </div>
          </div>
        )}

        {state.data && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto gap-4">
                <div className="flex items-center gap-2 flex-grow w-full">
                  <div className="h-px bg-slate-700 flex-grow"></div>
                  <h2 className="text-slate-400 font-medium text-sm uppercase tracking-widest whitespace-nowrap px-4">Resultados da Análise</h2>
                  <div className="h-px bg-slate-700 flex-grow"></div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={handleCopyReport}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-all active:scale-95"
                      title="Copiar Relatório Completo"
                    >
                      {reportCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span>{reportCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <button 
                      onClick={handlePrintPDF}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium shadow-lg hover:shadow-brand-500/25 transition-all active:scale-95"
                      title="Salvar como PDF ou Imprimir"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Salvar PDF</span>
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.data.map((niche, index) => (
                <NicheCard key={index} niche={niche} index={index} />
              ))}
            </div>
          </div>
        )}

        {!state.data && !state.isLoading && !state.error && (
            <div className="text-center mt-20 opacity-50">
                <p className="text-sm text-slate-500">
                    Experimente buscar por: "Histórias de Mistério", "Curiosidades", "Tecnologia", escolha o País.
                </p>
            </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-sm w-full p-6 shadow-2xl relative animate-fade-in-up">
              <button 
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 p-1 rounded-full hover:bg-slate-700 transition-colors"
              >
                  <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                 <h3 className="text-xl font-bold text-white mb-2">Compartilhar App</h3>
                 <p className="text-slate-400 text-sm">Mostre essa ferramenta para seus amigos!</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 <button 
                   onClick={() => handleSocialShare('whatsapp')}
                   className="flex items-center justify-center gap-3 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                 >
                   <MessageCircle className="w-5 h-5" />
                   WhatsApp
                 </button>

                 <button 
                   onClick={() => handleSocialShare('telegram')}
                   className="flex items-center justify-center gap-3 w-full py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                 >
                   <Send className="w-5 h-5" />
                   Telegram
                 </button>

                 <button 
                   onClick={() => handleSocialShare('copy')}
                   className="flex items-center justify-center gap-3 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all border border-slate-600 active:scale-95"
                 >
                   {linkCopied ? <Check className="w-5 h-5 text-green-400" /> : <Link className="w-5 h-5" />}
                   {linkCopied ? 'Link Copiado!' : 'Copiar Link'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Install Instruction Modal */}
      {showInstallHelp && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6 shadow-2xl relative animate-fade-in-up">
                <button 
                    onClick={() => setShowInstallHelp(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 p-1 rounded-full hover:bg-slate-700 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-brand-600 rounded-xl">
                        <MonitorDown className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Instalar o App</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                        <Monitor className="w-6 h-6 text-brand-400 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold text-white mb-1">No Computador (Chrome/Edge)</p>
                            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                                <li>Procure o ícone <MonitorDown className="w-3 h-3 inline mx-1"/> na barra de endereços (canto direito).</li>
                                <li>Ou vá no menu (⋮) e clique em <strong>"Instalar NichoTube Finder"</strong>.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/50">
                        <Smartphone className="w-6 h-6 text-brand-400 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold text-white mb-1">No Celular (Android/iOS)</p>
                            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                                <li>Toque no botão de menu ou compartilhar.</li>
                                <li>Procure a opção <strong>"Adicionar à Tela Inicial"</strong>.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setShowInstallHelp(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 active:scale-95"
                >
                    Entendi, vou tentar!
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;