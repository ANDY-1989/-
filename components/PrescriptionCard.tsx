import React from 'react';
import { PrescriptionResult } from '../types';
import { BookOpen, AlertTriangle, FlaskConical, Feather, Activity, Link2, Star, MapPin, ShoppingBag, Sprout } from 'lucide-react';

interface PrescriptionCardProps {
  data: PrescriptionResult;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ data, isFavorite = false, onToggleFavorite }) => {
  return (
    <div className="bg-[#fdfbf7] border border-stone-300 rounded-sm shadow-xl overflow-hidden animate-fade-in relative">
      {/* Title Section */}
      <div className="bg-stone-800 text-stone-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-red-900 pr-16 relative">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-widest mb-2">{data.prescriptionName}</h2>
          <p className="text-stone-400 italic text-sm flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> 出处：{data.sourceChapter}
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-red-900/30 border border-red-900/50 px-4 py-2 rounded text-red-100 text-xs md:text-sm max-w-xs">
           <span className="font-bold">辨证思路：</span>{data.matchedSymptoms}
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            className="absolute top-6 right-4 p-2 rounded-full hover:bg-stone-700 transition-colors group"
            title={isFavorite ? "取消收藏" : "加入收藏"}
          >
            <Star 
              className={`w-6 h-6 transition-all ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-stone-400 group-hover:text-yellow-400'}`} 
            />
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Ingredients & Origin Analysis */}
        <div>
           <h3 className="text-stone-800 font-bold flex items-center gap-2 mb-4 border-b border-stone-200 pb-2">
              <Sprout className="w-5 h-5 text-green-700" /> 方剂组成与选材指南
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ingredients.map((item, index) => (
              <div key={index} className="bg-white border border-stone-200 rounded p-4 hover:border-stone-400 transition-colors shadow-sm">
                <div className="flex justify-between items-baseline mb-2 border-b border-stone-100 pb-1">
                  <span className="text-lg font-serif font-bold text-stone-900">{item.name}</span>
                  <span className="text-stone-600 font-bold">{item.dosage}</span>
                </div>
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-stone-400 mt-0.5 shrink-0" />
                    <span className="leading-tight"><span className="text-stone-400 mr-1">道地:</span>{item.origin || "暂无记录"}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ShoppingBag className="w-3 h-3 text-red-300 mt-0.5 shrink-0" />
                    <span className="leading-tight"><span className="text-stone-400 mr-1">甄别:</span>{item.buyingTips || "暂无记录"}</span>
                  </div>
                </div>
              </div>
            ))}
           </div>
        </div>

        {/* Original Text & Translation */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-red-900 font-bold border-l-4 border-red-900 pl-3 flex items-center gap-2">
              <Feather className="w-4 h-4" /> 原文
            </h3>
            <div className="p-4 bg-stone-100 rounded text-stone-800 font-serif leading-loose text-lg border-l-2 border-stone-300">
              {data.originalText}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-stone-700 font-bold border-l-4 border-stone-500 pl-3">
              白话译文
            </h3>
            <div className="text-stone-600 leading-relaxed text-sm md:text-base">
              {data.translation}
            </div>
          </div>
        </div>

        {/* Usage & Precautions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-stone-800 font-bold flex items-center gap-2 border-b border-stone-200 pb-1">
              <FlaskConical className="w-5 h-5 text-amber-700" /> 煎服方法
            </h3>
            <p className="text-stone-700 leading-relaxed whitespace-pre-line text-sm">
              {data.usageMethod}
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-red-800 font-bold flex items-center gap-2 border-b border-red-100 pb-1">
              <AlertTriangle className="w-5 h-5" /> 禁忌与注意事项
            </h3>
            <p className="text-red-900/80 bg-red-50 p-3 rounded border border-red-100 text-sm leading-relaxed">
              {data.precautions}
            </p>
          </div>
        </div>

        {/* Pharmacology */}
        <div className="bg-stone-100/50 p-5 rounded-lg border border-stone-200">
           <h3 className="text-stone-800 font-bold flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-teal-700" /> 药理分析
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {data.pharmacology}
            </p>
        </div>

        {/* Related Prescriptions */}
        {data.relatedPrescriptions && data.relatedPrescriptions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-stone-300 border-dashed">
            <h3 className="text-stone-800 font-bold flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-indigo-700" /> 相关方剂推荐
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.relatedPrescriptions.map((item, index) => (
                <div key={index} className="bg-white border border-stone-200 p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-serif font-bold text-stone-900 mb-1">{item.name}</h4>
                  <p className="text-stone-600 text-sm">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;