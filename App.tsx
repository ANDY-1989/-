import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PrescriptionCard from './components/PrescriptionCard';
import FavoritesList from './components/FavoritesList';
import ConsultationAnalysis from './components/ConsultationAnalysis';
import SearchHistory from './components/SearchHistory';
import { getPrescription } from './services/geminiService';
import { ConsultationResult, PrescriptionResult, QueryStatus, SearchHistoryItem, Ingredient } from './types';
import { Search, Loader2, Star, BookText, Library } from 'lucide-react';

const App: React.FC = () => {
  const [queryInput, setQueryInput] = useState('');
  const [status, setStatus] = useState<QueryStatus>(QueryStatus.IDLE);
  
  // result now holds the complex consultation result
  const [result, setResult] = useState<ConsultationResult | null>(null);
  
  // For favorites, we still just store individual PrescriptionResult items
  const [favorites, setFavorites] = useState<PrescriptionResult[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load favorites and history from local storage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('jinGuiFavorites');
      if (savedFavorites) {
        let parsed = JSON.parse(savedFavorites);
        
        // DATA MIGRATION: Handle legacy data where ingredients was a string[]
        // We convert it to Ingredient[] to prevent crashes
        parsed = parsed.map((item: any) => {
           if (item.ingredients && item.ingredients.length > 0 && typeof item.ingredients[0] === 'string') {
             return {
               ...item,
               ingredients: item.ingredients.map((str: string) => ({
                 name: str,
                 dosage: '',
                 origin: '旧版数据',
                 buyingTips: '无选购指南'
               })) as Ingredient[]
             }
           }
           return item;
        });

        setFavorites(parsed);
      }
      
      const savedHistory = localStorage.getItem('jinGuiSearchHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load local storage data", e);
    }
  }, []);

  // Save favorites to local storage whenever they change
  const updateFavorites = (newFavorites: PrescriptionResult[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('jinGuiFavorites', JSON.stringify(newFavorites));
  };

  const handleToggleFavorite = (item: PrescriptionResult) => {
    const exists = favorites.some(fav => fav.prescriptionName === item.prescriptionName);
    if (exists) {
      updateFavorites(favorites.filter(fav => fav.prescriptionName !== item.prescriptionName));
    } else {
      updateFavorites([item, ...favorites]);
    }
  };

  const isFavorite = (item: PrescriptionResult): boolean => {
    return favorites.some(fav => fav.prescriptionName === item.prescriptionName);
  };

  const addToHistory = (query: string) => {
    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: Date.now()
    };

    // Remove duplicates (move matching query to top), keep max 15
    const newHistory = [
      newItem,
      ...history.filter(item => item.query !== newItem.query)
    ].slice(0, 15);

    setHistory(newHistory);
    localStorage.setItem('jinGuiSearchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (confirm('确定要清空所有历史查询记录吗？')) {
      setHistory([]);
      localStorage.removeItem('jinGuiSearchHistory');
    }
  };

  const handleHistorySelect = (query: string) => {
    setQueryInput(query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsult = async () => {
    if (!queryInput.trim()) return;

    // Add to history before searching
    addToHistory(queryInput);

    setStatus(QueryStatus.LOADING);
    setErrorMsg(null);
    setResult(null);

    try {
      const data = await getPrescription(queryInput);
      setResult(data);
      setStatus(QueryStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMsg("查询过程中发生错误，请稍后重试或检查网络连接。");
      setStatus(QueryStatus.ERROR);
    }
  };

  // Helper to view a favorite (mocking a consultation result for a single item)
  const handleViewFavorite = (item: PrescriptionResult) => {
    setResult({
      symptomAnalysis: "来自收藏夹的历史记录。",
      comparison: "无对比数据。",
      recommendation: "您收藏的方剂。",
      prescriptions: [item]
    });
    setStatus(QueryStatus.SUCCESS);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-300 gap-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all ${
              activeTab === 'search' 
                ? 'bg-white border-x border-t border-stone-300 text-stone-900 shadow-sm relative top-[1px]' 
                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
            }`}
          >
            <Search className="w-4 h-4" /> 辨证查询
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all ${
              activeTab === 'favorites' 
                ? 'bg-white border-x border-t border-stone-300 text-stone-900 shadow-sm relative top-[1px]' 
                : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
            }`}
          >
            <Star className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-yellow-500 text-yellow-500' : ''}`} /> 
            方剂收藏 
            <span className="bg-stone-600 text-white text-[10px] px-1.5 rounded-full ml-1">
              {favorites.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' ? (
          <div className="animate-fade-in">
            {/* Search Box */}
            <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow-md border border-stone-200 mb-8 mt-[-1px]">
              <label htmlFor="query" className="block text-stone-700 font-bold mb-3 text-lg border-l-4 border-stone-800 pl-3 flex justify-between">
                <span>症状 / 关键词</span>
                <span className="text-xs font-normal text-stone-400 self-center flex items-center gap-1">
                   <Library className="w-3 h-3" /> 检索范围：金匮・伤寒・千金・内经
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="query"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="请输入症状（如：头痛发热、胸闷气短...）&#10;系统将从多部中医典籍中为您寻找对症方剂并进行对比。"
                  className="w-full h-32 p-4 text-stone-800 bg-stone-50 border border-stone-300 rounded focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-stone-400"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleConsult}
                    disabled={status === QueryStatus.LOADING || !queryInput.trim()}
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-50 px-8 py-3 rounded shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wide"
                  >
                    {status === QueryStatus.LOADING ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        正在查阅典籍...
                      </>
                    ) : (
                      <>
                        <BookText className="w-5 h-5" />
                        开始辨证
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results Area */}
            <div className="min-h-[200px]">
              {status === QueryStatus.IDLE && !result && (
                <>
                  <div className="text-center text-stone-400 py-6 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-stone-200 rounded-full flex items-center justify-center mb-4 text-stone-300 font-serif text-3xl">
                      医
                    </div>
                    <p>请输入症状，AI 将综合《伤寒》、《金匮》、《千金》等典籍为您分析。</p>
                  </div>
                  
                  {/* Show history only when no results are shown (Idle state) */}
                  <SearchHistory 
                    history={history}
                    onSelect={handleHistorySelect}
                    onClear={clearHistory}
                  />
                </>
              )}

              {status === QueryStatus.ERROR && (
                 <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded shadow-sm text-center">
                   <p className="text-red-800 font-bold text-lg mb-2">出错了</p>
                   <p className="text-red-700">{errorMsg}</p>
                 </div>
              )}

              {result && (
                <div className="space-y-8">
                  {/* Summary and Comparison Section */}
                  {(result.symptomAnalysis || result.comparison) && (
                    <ConsultationAnalysis 
                      symptomAnalysis={result.symptomAnalysis}
                      comparison={result.comparison}
                      recommendation={result.recommendation}
                    />
                  )}

                  {/* Individual Prescription Cards */}
                  <div className="grid gap-8">
                    {result.prescriptions.map((prescription, idx) => (
                       <div key={idx} className="relative">
                          {/* Visual connector line between cards if multiple */}
                          {idx > 0 && <div className="absolute -top-8 left-1/2 w-px h-8 bg-stone-300 border-l border-dashed border-stone-400"></div>}
                          
                          {/* Label for Options */}
                          {result.prescriptions.length > 1 && (
                            <div className="mb-2 inline-block bg-stone-800 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                              方案 {idx + 1}
                            </div>
                          )}
                          
                          <PrescriptionCard 
                            data={prescription} 
                            isFavorite={isFavorite(prescription)}
                            onToggleFavorite={() => handleToggleFavorite(prescription)}
                          />
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Favorites Tab Content */
          <div className="bg-stone-50 min-h-[400px]">
            <FavoritesList 
              favorites={favorites} 
              onSelect={handleViewFavorite}
              onRemove={(item) => handleToggleFavorite(item)}
            />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default App;