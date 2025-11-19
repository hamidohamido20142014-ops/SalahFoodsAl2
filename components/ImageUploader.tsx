import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, ScanSearch } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (preview) {
      onImageSelect(preview);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className="w-full animate-fade-in space-y-4">
        {/* Image Preview Container - Responsive & Centered */}
        <div className="relative w-full bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner group">
          {/* Background pattern or color for transparent images */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDBoMTB2MTBIMTB6TTAgMTBoMTB2MTBIMHoiIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-50" />
          
          <img 
            src={preview} 
            alt="Selected product" 
            className="relative z-10 w-full h-auto max-h-[60vh] object-contain mx-auto block" 
          />
          
          {/* Quick Cancel Button */}
          <button 
            onClick={handleRetake}
            className="absolute top-3 right-3 bg-white/90 text-slate-600 p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors z-20 backdrop-blur-sm"
            aria-label="إلغاء الصورة"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRetake}
            className="flex-1 py-3.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            تغيير الصورة
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[1.5] py-3.5 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <ScanSearch size={20} />
            <span>تحليل المكونات</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="grid grid-cols-2 gap-4">
        {/* Camera Button */}
        <button
          onClick={handleTriggerUpload}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-green-50 border-2 border-green-200 rounded-2xl active:scale-95 transition-transform hover:bg-green-100 cursor-pointer group"
        >
          <div className="bg-white p-4 rounded-full shadow-sm text-green-600 group-hover:text-green-700 transition-colors">
            <Camera size={32} />
          </div>
          <span className="font-bold text-green-800">تصوير منتج</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={handleTriggerUpload}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white border-2 border-slate-200 rounded-2xl active:scale-95 transition-transform hover:border-green-300 cursor-pointer group"
        >
          <div className="bg-slate-50 p-4 rounded-full shadow-sm text-slate-500 group-hover:text-slate-700 transition-colors">
            <Upload size={32} />
          </div>
          <span className="font-bold text-slate-600">رفع صورة</span>
        </button>
      </div>

      <p className="text-center text-slate-400 text-sm mt-4 flex items-center justify-center gap-2">
        <ImageIcon size={14} />
        <span>يدعم صور JPG, PNG للمكونات الغذائية</span>
      </p>
    </div>
  );
};