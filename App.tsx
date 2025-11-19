import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { analyzeImage } from './services/geminiService';
import { AnalysisState, HistoryItem } from './types';
import { getHistory, saveToHistory, deleteFromHistory } from './utils/storage';
import { Loader2, ScanSearch, X, AlertTriangle } from 'lucide-react';

type ViewState = 'home' | 'results' | 'history';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imageSrc: null,
  });

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleImageSelect = useCallback(async (base64: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, imageSrc: base64 }));
    setView('results'); // Switch to results view to show loader

    try {
      const result = await analyzeImage(base64);
      
      // Save to history
      saveToHistory(result);
      setHistory(getHistory()); // Update local state

      setState(prev => ({ ...prev, isLoading: false, result }));
    } catch (error: any) {
      let errorMessage = error.message || "حدث خطأ غير متوقع أثناء التحليل";
      
      if (errorMessage.includes("API key") || errorMessage.includes("403")) {
        errorMessage = "عذراً، هناك مشكلة في مفتاح API. يرجى التأكد من إعدادات المفتاح وصلاحيته.";
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      // Keep view on results/home depending on where we want to show error. 
      // Usually stay on the current screen or go back to home to retry.
      // For now, we display the error in the main container, so view='home' acts as the container.
      setView('home');
    }
  }, []);

  const resetApp = () => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      imageSrc: null,
    });
    setView('home');
  };

  const retryAnalysis = () => {
    if (state.imageSrc) {
      handleImageSelect(state.imageSrc);
    } else {
      dismissError();
    }
  };

  const dismissError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const toggleHistory = () => {
    if (view === 'history') {
      // If currently in history, go back to where we were (or home if no result)
      if (state.result) {
        setView('results');
      } else {
        setView('home');
      }
    } else {
      setView('history');
      setHistory(getHistory()); // Refresh history
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setState({
      isLoading: false,
      error: null,
      result: item.result,
      imageSrc: null, // We don't store images in history to save space
    });
    setView('results');
  };

  const handleHistoryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteFromHistory(id);
    setHistory(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans">
      <Navbar onHistoryClick={toggleHistory} activeView={view} />

      <main className="max-w-md mx-auto px-4 pt-8">
        
        {/* Error Display - Always visible if exists */}
        {state.error && view === 'home' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 relative animate-fade-in shadow-sm mb-6">
            <button 
              onClick={dismissError}
              className="absolute top-4 left-4 text-red-400 hover:text-red-600 transition-colors p-1 bg-red-50 rounded-full"
              aria-label="إغلاق التنبيه"
            >
              <X size={18} />
            </button>
            
            <div className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0 mt-1">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-800 mb-2 text-base">تعذر إتمام التحليل</h4>
                <p className="text-red-700 text-sm leading-relaxed mb-4 pl-4">
                  {state.error}
                </p>
                
                {state.imageSrc && (
                  <div className="mb-4">
                    <p className="text-xs text-red-500 mb-2 font-medium">الصورة المستخدمة:</p>
                    <img 
                      src={state.imageSrc} 
                      alt="Failed upload" 
                      className="w-24 h-24 object-cover rounded-lg border-2 border-red-200 shadow-sm"
                    />
                  </div>
                )}

                <button 
                  onClick={retryAnalysis}
                  className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl transition-colors shadow-sm active:scale-95 w-full sm:w-auto"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {view === 'home' && !state.isLoading && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mt-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6">
                <ScanSearch size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">اكتشف ماذا تأكل</h2>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                قم بتصوير قائمة المكونات لأي منتج، وسيقوم الذكاء الاصطناعي بتحليلها وإخبارك عن مدى صحتها وسلامتها.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">ابدأ التحليل الآن</h3>
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
          </div>
        )}

        {/* LOADING VIEW */}
        {state.isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-pulse">
             <div className="relative">
               <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-green-500 animate-spin"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <ScanSearch size={32} className="text-green-500" />
               </div>
             </div>
             <div className="text-center space-y-2">
               <h3 className="text-xl font-bold text-slate-800">جاري تحليل المكونات...</h3>
               <p className="text-slate-500 text-sm">يقوم نموذج Gemini بقراءة الملصق الآن</p>
             </div>
             
             {state.imageSrc && (
               <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white shadow-lg mt-4 opacity-50 grayscale">
                 <img src={state.imageSrc} alt="Preview" className="w-full h-full object-cover" />
               </div>
             )}
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === 'results' && !state.isLoading && state.result && (
          <ResultsView result={state.result} onReset={resetApp} />
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <HistoryView 
            history={history} 
            onSelect={handleHistorySelect}
            onDelete={handleHistoryDelete}
            onBack={() => setView(state.result ? 'results' : 'home')}
          />
        )}

      </main>
    </div>
  );
};

export default App;