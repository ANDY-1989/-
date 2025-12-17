import React from 'react';
import { SearchHistoryItem } from '../types';
import { Clock, Trash2, RotateCcw } from 'lucide-react';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-3 border-b border-stone-200 pb-2">
        <h3 className="text-stone-500 font-bold text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" /> 最近查询记录
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-stone-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> 清空历史
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {history.map((item) => (
          <button
            key={item.timestamp}
            onClick={() => onSelect(item.query)}
            className="group flex flex-col items-start p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-400 hover:shadow-md transition-all text-left"
          >
            <span className="text-stone-800 font-serif text-sm line-clamp-1 w-full mb-1 group-hover:text-stone-900 font-medium">
              {item.query}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              {formatDate(item.timestamp)}
              <RotateCcw className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;