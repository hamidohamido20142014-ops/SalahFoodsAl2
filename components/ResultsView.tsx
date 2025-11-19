import React from 'react';
import { AnalysisResult, IngredientStatus } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Info, PieChart } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status: IngredientStatus) => {
    switch (status) {
      case IngredientStatus.SAFE: return <CheckCircle className="text-green-500" size={20} />;
      case IngredientStatus.WARNING: return <Info className="text-yellow-500" size={20} />;
      case IngredientStatus.DANGER: return <AlertTriangle className="text-red-500" size={20} />;
      default: return <Info className="text-slate-400" size={20} />;
    }
  };

  const getStatusStyle = (status: IngredientStatus) => {
    switch (status) {
      case IngredientStatus.SAFE: return 'bg-white border-l-4 border-green-400';
      case IngredientStatus.WARNING: return 'bg-yellow-50/50 border-l-4 border-yellow-400';
      case IngredientStatus.DANGER: return 'bg-red-50/50 border-l-4 border-red-500 shadow-sm ring-1 ring-red-100';
      default: return 'bg-slate-50';
    }
  };

  // Chart Data
  const stats = {
    safe: result.ingredients.filter(i => i.status === IngredientStatus.SAFE).length,
    warning: result.ingredients.filter(i => i.status === IngredientStatus.WARNING).length,
    danger: result.ingredients.filter(i => i.status === IngredientStatus.DANGER).length,
  };
  
  const chartData = [
    { name: 'آمن', value: stats.safe, color: '#22c55e' },
    { name: 'تنبيه', value: stats.warning, color: '#eab308' },
    { name: 'خطر', value: stats.danger, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in-up pb-24">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold mb-4 border-4 ${getScoreColor(result.overallScore).replace('text-', 'border-').replace('bg-', 'bg-white ')}`}>
          {result.overallScore}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{result.productName}</h2>
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm mb-4">
          {result.productType === 'Food' ? 'منتج غذائي' : result.productType === 'Cosmetic' ? 'مستحضر تجميل' : 'غير محدد'}
        </span>
        <p className="text-slate-600 leading-relaxed text-sm">
          {result.summary}
        </p>
      </div>

      {/* Chart Section */}
      {result.ingredients.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-slate-400"/>
            توزيع المكونات
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  itemStyle={{fontFamily: 'Cairo'}}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-600">
            {stats.safe > 0 && <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/> آمن ({stats.safe})</span>}
            {stats.warning > 0 && <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"/> تنبيه ({stats.warning})</span>}
            {stats.danger > 0 && <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> خطر ({stats.danger})</span>}
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 px-2">تفاصيل المكونات</h3>
        {result.ingredients.map((ing, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border border-slate-100 transition-all hover:shadow-md ${getStatusStyle(ing.status)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800">{ing.name}</h4>
                  {ing.status === IngredientStatus.DANGER && (
                    <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">ضار</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {ing.description}
                </p>
              </div>
              <div className="mt-1">
                {getStatusIcon(ing.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button for Reset */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-slate-900 transition-colors"
        >
          <XCircle size={20} />
          <span>تحليل منتج جديد</span>
        </button>
      </div>

    </div>
  );
};
