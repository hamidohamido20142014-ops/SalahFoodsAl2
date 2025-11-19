import React from 'react';
import { Leaf, History } from 'lucide-react';

interface NavbarProps {
  onHistoryClick?: () => void;
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onHistoryClick, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-green-500 p-2 rounded-full text-white">
            <Leaf size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            مأكولات <span className="text-green-600">صلاح</span>
          </h1>
        </div>

        {onHistoryClick && (
          <button 
            onClick={onHistoryClick}
            className={`p-2 rounded-xl transition-colors flex items-center gap-2 ${activeView === 'history' ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            aria-label="سجل الفحص"
          >
            <span className="hidden sm:inline font-bold text-sm">السجل</span>
            <History size={22} />
          </button>
        )}
      </div>
    </nav>
  );
};