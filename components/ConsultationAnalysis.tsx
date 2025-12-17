import React from 'react';
import { Activity, GitCompare, CheckCircle2 } from 'lucide-react';

interface ConsultationAnalysisProps {
  symptomAnalysis: string;
  comparison: string;
  recommendation: string;
}

const ConsultationAnalysis: React.FC<ConsultationAnalysisProps> = ({ symptomAnalysis, comparison, recommendation }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-md p-6 mb-8 animate-fade-in space-y-6">
      
      {/* Symptom Analysis */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
          <Activity className="w-5 h-5 text-red-700" /> 
          <span>辨证分析</span>
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm md:text-base">
          {symptomAnalysis}
        </p>
      </div>

      {/* Comparison */}
      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200/60">
        <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800 mb-3">
          <GitCompare className="w-5 h-5 text-indigo-700" /> 
          <span>方剂异同对比</span>
        </h3>
        <p className="text-stone-600 leading-relaxed text-sm">
          {comparison}
        </p>
      </div>

      {/* Recommendation */}
      <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
        <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" /> 
          <span>专家建议</span>
        </h3>
        <p className="text-emerald-900/80 leading-relaxed text-sm font-medium">
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default ConsultationAnalysis;