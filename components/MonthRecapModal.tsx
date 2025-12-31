
import React, { useEffect } from 'react';
import { MonthlyData } from '../types';
import { MONTH_NAMES, getScoreColor } from '../constants';
import { X, Star, Quote, LayoutGrid, ChevronLeft, ChevronRight, Image as ImageIcon, Users, MapPin, Heart, AlertCircle, TrendingUp } from 'lucide-react';

interface MonthRecapModalProps {
  data: MonthlyData[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onClose: () => void;
}

const MonthRecapModal: React.FC<MonthRecapModalProps> = ({ data, currentIndex, onPrev, onNext, isFirst, isLast, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && !isFirst) onPrev();
      if (e.key === 'ArrowRight' && !isLast) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, isFirst, isLast]);

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-hidden"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="fixed top-5 right-5 z-[150] p-3 bg-white/10 text-white rounded-full transition-all hover:bg-white/20"
      >
        <X size={24} />
      </button>

      {/* PC 전용 내비게이션 */}
      <div className="hidden lg:contents">
        {!isFirst && (
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-[140] w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft size={36} />
          </button>
        )}
        {!isLast && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-[140] w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight size={36} />
          </button>
        )}
      </div>

      <div 
        className="relative w-full h-full flex items-center transition-transform duration-500"
        style={{ transform: `translateX(calc(50% - ${currentIndex * 100}% - 50%))` }}
      >
        {data.map((monthData, idx) => {
          const isActive = idx === currentIndex;
          const color = getScoreColor(monthData.score);

          return (
            <div 
              key={idx}
              className={`relative shrink-0 w-full flex justify-center px-4 md:px-12 transition-all duration-500 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-10 scale-90 blur-sm pointer-events-none'
              }`}
            >
              <div 
                className="bg-white w-full max-w-5xl rounded-[32px] md:rounded-[56px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 콘텐츠 영역: pb-32를 추가하여 하단 내비바 공간 확보 */}
                <div className="relative p-6 md:p-14 pb-32 md:pb-14 overflow-y-auto scrollbar-hide">
                  <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div 
                        className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl font-black border border-white shadow-lg shrink-0"
                        style={{ backgroundColor: `${color}15`, color: color }}
                      >
                        {monthData.month}
                      </div>
                      <div>
                        <span className="text-[8px] md:text-xs font-black text-slate-300 uppercase tracking-widest block mb-0.5 md:mb-1">MONTH RECAP</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl md:text-4xl font-black text-slate-900 leading-none">{monthData.score}</span>
                          <span className="text-sm md:text-xl font-bold text-slate-200">/ 100</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right">
                       <h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                        {monthData.title || "이달의 제목"}
                      </h3>
                    </div>
                  </header>

                  <div className="space-y-8 md:space-y-16">
                    {/* 사진 섹션 */}
                    {(monthData.images || []).length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-3 text-slate-200">
                          <ImageIcon size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Memories</span>
                        </div>
                        <div className="flex gap-4 md:gap-6 overflow-x-auto py-2 px-1 scrollbar-hide h-[220px] md:h-[450px] items-center">
                          {monthData.images?.map((img, i) => (
                            <div 
                              key={i} 
                              className="shrink-0 h-full rounded-2xl md:rounded-[40px] overflow-hidden shadow-md border-2 border-white bg-slate-50"
                            >
                              <img src={img} alt="memory" className="h-full w-auto object-contain" />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* 메인 노트 */}
                    <section>
                      <div className="flex items-center gap-2 mb-3 text-slate-200">
                        <Quote size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Notes</span>
                      </div>
                      <p className="text-base md:text-2xl font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-6 md:p-14 rounded-[24px] md:rounded-[56px] border border-slate-100 italic">
                        "{monthData.note || "기록된 내용이 없습니다."}"
                      </p>
                    </section>

                    {/* 감사/아쉬움/개선점 (Recap) */}
                    {(monthData.gratitude || monthData.regret || monthData.improvement) && (
                      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {monthData.gratitude && (
                          <div className="p-5 md:p-10 bg-rose-50/30 rounded-2xl md:rounded-[48px] border border-rose-100">
                            <span className="text-[8px] md:text-xs font-black uppercase tracking-widest block mb-2 text-rose-400">Gratitude</span>
                            <p className="text-sm md:text-lg font-bold text-slate-700 leading-relaxed">{monthData.gratitude}</p>
                          </div>
                        )}
                        {monthData.regret && (
                          <div className="p-5 md:p-10 bg-slate-50 rounded-2xl md:rounded-[48px] border border-slate-100">
                            <span className="text-[8px] md:text-xs font-black uppercase tracking-widest block mb-2 text-slate-400">Regret</span>
                            <p className="text-sm md:text-lg font-bold text-slate-600 leading-relaxed">{monthData.regret}</p>
                          </div>
                        )}
                        {monthData.improvement && (
                          <div className="p-5 md:p-10 bg-emerald-50/30 rounded-2xl md:rounded-[48px] border border-emerald-100">
                            <span className="text-[8px] md:text-xs font-black uppercase tracking-widest block mb-2 text-emerald-400">Improvement</span>
                            <p className="text-sm md:text-lg font-bold text-slate-700 leading-relaxed">{monthData.improvement}</p>
                          </div>
                        )}
                      </section>
                    )}

                    {/* 성취 목록 */}
                    {(monthData.achievements || []).length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-5 text-amber-400">
                          <Star size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Achievements</span>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {monthData.achievements?.map((a, i) => (
                            <li key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                              <Star size={16} className="text-amber-400 shrink-0" fill="currentColor" />
                              <span className="text-xs md:text-xl font-black text-slate-700 truncate">{a}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 모바일 하단 내비게이션 바: 더 높게 띄우고 그림자 강화 */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 p-2.5 bg-white/95 backdrop-blur-2xl rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border border-white/50">
        <button 
          disabled={isFirst}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="p-2.5 bg-slate-100 rounded-full disabled:opacity-30 active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-[60px] text-center">
          <span className="text-base font-black text-slate-900 tracking-tight">{currentIndex + 1}월</span>
        </div>
        <button 
          disabled={isLast}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="p-2.5 bg-slate-100 rounded-full disabled:opacity-30 active:scale-90 transition-transform"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MonthRecapModal;
