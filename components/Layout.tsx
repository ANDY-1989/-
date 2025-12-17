import React, { ReactNode } from 'react';
import { ScrollText, Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-stone-900 text-stone-200 py-6 shadow-md border-b-4 border-red-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold tracking-widest font-serif">方剂寻踪</h1>
          </div>
          <p className="text-stone-400 text-sm font-light tracking-wide">
            基于中国古代经典方剂的智能辨证与方剂检索系统
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-stone-200 text-stone-600 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-red-800 font-bold">
            <Info className="w-4 h-4" />
            <span>重要免责声明</span>
          </div>
          <p className="text-xs max-w-2xl mx-auto leading-relaxed">
            本系统由人工智能生成，仅供中医学习、研究与参考。
            <br/>
            <strong>生成结果不能替代专业医师的诊断与治疗。</strong>
            身体不适请务必前往正规医疗机构就诊。请勿仅凭本结果自行抓药煎服。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;