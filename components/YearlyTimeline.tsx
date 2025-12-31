
import React from 'react';
import { MonthlyData } from '../types';
import { getScoreColor, MONTH_NAMES } from '../constants';
import { ArrowRight, Calendar } from 'lucide-react';

interface YearlyTimelineProps {
  data: MonthlyData[];
  onMonthClick: (monthIndex: number) => void;
}

const YearlyTimeline: React.FC<YearlyTimelineProps> = ({ data, onMonthClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {data.map((d, i) => {
        const color = getScoreColor(d.score);
        return (
          <button 
            key={i} 
            onClick={() => onMonthClick(i)}
            className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left w-full"
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div 
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl shadow-md"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                {d.month}
              </div>
              <div className="text-right">
                <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-0.5">Satisfaction</span>
                <span className="text-lg md:text-2xl font-black text-slate-800">{d.score}</span>
              </div>
            </div>
            
            <h4 className="text-base md:text-lg font-black text-slate-900 mb-2 truncate group-hover:text-rose-500 transition-colors">
              {d.title || `${d.month}월의 기록`}
            </h4>
            
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4 md:mb-6">
              {d.note || "기록된 내용이 없습니다."}
            </p>

            <div className="pt-4 md:pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex -space-x-1.5">
                {d.categories.filter(c => c.value).slice(0, 3).map((c, idx) => (
                  <div 
                    key={idx} 
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[7px] md:text-[8px] font-black text-slate-400"
                    title={c.name}
                  >
                    {c.name[0]}
                  </div>
                ))}
              </div>
              <div className="text-[9px] md:text-[10px] font-black text-slate-300 flex items-center gap-1 group-hover:text-slate-900 transition-colors">
                상세보기 <ArrowRight size={10} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default YearlyTimeline;
