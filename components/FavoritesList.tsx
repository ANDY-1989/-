import React from 'react';
import { PrescriptionResult } from '../types';
import { BookOpen, ArrowRight, Trash2 } from 'lucide-react';

interface FavoritesListProps {
  favorites: PrescriptionResult[];
  onSelect: (item: PrescriptionResult) => void;
  onRemove: (item: PrescriptionResult) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onRemove }) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <div className="mb-4 text-5xl opacity-20">★</div>
        <p>暂无收藏的方剂。</p>
        <p className="text-sm mt-2">在查询结果中点击星星图标即可收藏。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {favorites.map((item, index) => (
        <div 
          key={`${item.prescriptionName}-${index}`}
          className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-serif font-bold text-stone-800">{item.prescriptionName}</h3>
              <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200">
                {item.sourceChapter}
              </span>
            </div>
            <p className="text-stone-500 text-sm line-clamp-1 mb-2 italic">
               <BookOpen className="w-3 h-3 inline mr-1" />
               {item.ingredients.map(i => `${i.name}${i.dosage ? `(${i.dosage})` : ''}`).join('、')}
            </p>
            <p className="text-stone-600 text-sm border-l-2 border-red-200 pl-2">
              {item.matchedSymptoms}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <button
              onClick={() => onSelect(item)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-stone-800 text-stone-100 px-4 py-2 rounded text-sm hover:bg-stone-700 transition-colors"
            >
              查看详情 <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item);
              }}
              className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="移除收藏"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;