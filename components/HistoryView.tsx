import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Calendar, ChevronLeft, Trash2, ScanLine } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, onBack }) => {
  
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('ar-EG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="animate-fade-in min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-800">
          <Clock className="text-green-600" />
          <h2 className="text-2xl font-bold">سجل الفحص</h2>
        </div>
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
        >
          <ChevronLeft className="rtl:rotate-180" />
        </button>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Clock size={32} />
          </div>
          <p className="text-slate-500 font-medium">لا يوجد سجلات سابقة</p>
          <button 
            onClick={onBack}
            className="text-green-600 font-bold hover:underline mt-2"
          >
            ابدأ فحص جديد
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:shadow-md flex justify-between items-center group"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                {/* Score Badge */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0 ${getScoreColor(item.result.overallScore)}`}>
                  {item.result.overallScore}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{item.result.productName || 'منتج غير معروف'}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.result.productType === 'Food' ? 'غذاء' : item.result.productType === 'Cosmetic' ? 'تجميل' : 'آخر'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={(e) => onDelete(item.id, e)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};