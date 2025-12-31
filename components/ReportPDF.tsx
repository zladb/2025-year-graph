
import React, { useMemo } from 'react';
import { MonthlyData } from '../types';
import { getScoreColor } from '../constants';
import { Star, Users, MapPin, Trophy, Quote, Heart, AlertCircle, TrendingUp, Sparkles, LayoutGrid, Image as ImageIcon } from 'lucide-react';

interface ReportPDFProps {
  data: MonthlyData[];
  averageScore: number;
}

const ReportPDF: React.FC<ReportPDFProps> = ({ data, averageScore }) => {
  const stats = useMemo(() => {
    const best = data.reduce((prev, curr) => (curr.score >= prev.score ? curr : prev), data[0]);
    const worst = data.reduce((prev, curr) => (curr.score <= prev.score ? curr : prev), data[0]);
    return { best, worst };
  }, [data]);

  const getEmotionalMessage = (score: number) => {
    if (score >= 85) return "정말 눈부시게 빛나는 한 해를 완성해가고 계시네요.";
    if (score >= 70) return "행복의 조각들이 곳곳에 묻어나는 따뜻한 여정입니다.";
    if (score >= 50) return "잔잔한 평화와 성장이 함께하는 소중한 한 해군요.";
    if (score >= 30) return "가끔은 흔들려도, 묵묵히 나아가는 당신이 아름답습니다.";
    return "힘든 시간들 속에서도 잃지 않은 당신만의 빛을 응원합니다.";
  };

  const getGraphPath = (w: number, h: number, p: number) => {
    const xStep = (w - p * 2) / 11;
    let path = `M ${p} ${h - p - (data[0].score / 100) * (h - p * 2)}`;
    for (let i = 1; i < data.length; i++) {
      const x = p + i * xStep;
      const y = h - p - (data[i].score / 100) * (h - p * 2);
      const prevX = p + (i - 1) * xStep;
      const prevY = h - p - (data[i - 1].score / 100) * (h - p * 2);
      const cp1x = prevX + xStep / 2;
      const cp2x = x - xStep / 2;
      path += ` C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    }
    return path;
  };

  return (
    <div className="flex flex-col bg-white" style={{ background: '#ffffff', boxSizing: 'border-box' }}>
      {/* 1페이지: 연간 요약 (표지) */}
      <div 
        className="pdf-page w-[210mm] h-[297mm] p-20 flex flex-col items-center relative overflow-hidden bg-white" 
        style={{ width: '210mm', height: '297mm', minHeight: '297mm', boxSizing: 'border-box' }}
      >
        <div className="mt-28 mb-12 w-full flex flex-col items-center text-center">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            나의 <span className="text-rose-500 relative">2025<span className="absolute bottom-1 left-0 w-full h-3 bg-rose-100 -z-10"></span></span> 인생 그래프
          </h1>
        </div>

        <div className="w-full max-w-3xl mt-12 border-t border-slate-100 pt-16 flex items-center justify-center gap-14">
          <div className="shrink-0 text-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">YEARLY SATISFACTION</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-7xl font-black text-slate-900 leading-none">{averageScore}</span>
              <span className="text-xl font-bold text-slate-300">/ 100</span>
            </div>
          </div>
          <div className="h-24 w-px bg-slate-100" />
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4 text-rose-500">
              <Heart size={20} fill="currentColor" />
              <span className="text-lg font-black tracking-tight">올해를 되돌아보며</span>
            </div>
            <p className="text-2xl font-bold text-slate-500 italic leading-snug">
              "{getEmotionalMessage(averageScore)}"
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mt-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-10 bg-slate-900 rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">연간 만족도 추이</h2>
          </div>
          <div className="bg-slate-50 rounded-[48px] p-12 border border-slate-100 relative shadow-sm">
            <svg width="550" height="220" viewBox="0 0 550 220" className="overflow-visible mx-auto">
              <defs>
                <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>
              </defs>
              <path d={getGraphPath(550, 220, 30)} fill="none" stroke="url(#pdfGrad)" strokeWidth="6" strokeLinecap="round" />
              {data.map((d, i) => {
                const xStep = (550 - 60) / 11;
                const x = 30 + i * xStep;
                const y = 220 - 30 - (d.score / 100) * (220 - 60);
                const isBest = d.month === stats.best.month;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isBest ? "8" : "4"} fill="white" stroke={getScoreColor(d.score)} strokeWidth="3" />
                    <text x={x} y="215" textAnchor="middle" fontSize="10" fontWeight="900" fill="#cbd5e1">{d.month}월</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 월별 상세 페이지 (스크린샷 레이아웃) */}
      {data.map((m) => {
        const color = getScoreColor(m.score);
        const activeCategories = m.categories.filter(c => c.value);
        
        return (
          <div 
            key={m.month} 
            className="pdf-page w-[210mm] h-[297mm] px-16 py-12 flex flex-col bg-[#fcfcfc] border-b border-slate-100 relative"
            style={{ width: '210mm', height: '297mm', minHeight: '297mm', boxSizing: 'border-box' }}
          >
            {/* Header Area */}
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-slate-50 shrink-0">
                  <span className="text-[8px] font-black text-slate-300 tracking-widest uppercase mb-0.5">MONTH</span>
                  <span className="text-4xl font-black leading-none" style={{ color: color }}>{m.month}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-rose-400">{m.month}월의 기록</span>
                    <Sparkles size={12} className="text-rose-400" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{m.title || "이달의 제목"}</h2>
                </div>
              </div>
              <div className="w-24 h-24 rounded-[32px] bg-white shadow-2xl flex flex-col items-center justify-center border border-slate-50 shrink-0">
                <span className="text-[8px] font-black text-slate-300 uppercase block mb-1">SCORE</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-slate-900">{m.score}</span>
                  <span className="text-[10px] font-bold text-slate-300">/100</span>
                </div>
              </div>
            </header>

            <div className="flex gap-10 mb-8 flex-1 min-h-0">
              {/* Left Column (Main Content) */}
              <div className="flex-[1.5] flex flex-col gap-8 min-w-0">
                {/* 이달의 장면 */}
                <section>
                  <div className="flex items-center gap-3 mb-4 text-sky-400">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                      <LayoutGrid size={16} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">이달의 장면</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {m.images && m.images.length > 0 ? (
                      m.images.slice(0, 3).map((img, i) => (
                        <div key={i} className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white">
                          <img src={img} className="w-full h-full object-cover" alt="memory" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 aspect-[3/1] bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center">
                        <span className="text-slate-300 font-bold text-sm">기록된 장면이 없습니다.</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* 회고 */}
                <section className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-3 mb-4 text-rose-400">
                    <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                      <Quote size={16} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">회고</h3>
                  </div>
                  <div className="flex-1 p-8 bg-white rounded-[40px] border border-slate-50 shadow-sm italic text-lg font-medium text-slate-600 leading-relaxed flex items-center justify-center text-center overflow-hidden">
                    <p className="max-w-[85%]">
                      {m.note ? `"${m.note}"` : "작성된 내용이 없습니다."}
                    </p>
                  </div>
                </section>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="flex-1 flex flex-col gap-8">
                {/* 하이라이트 */}
                <section className="bg-sky-50/30 p-8 rounded-[40px] border border-sky-100 flex flex-col gap-6">
                  <div className="flex items-center gap-3 text-sky-500">
                    <Sparkles size={18} />
                    <h3 className="text-xl font-black tracking-tight">하이라이트</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-sky-50 shadow-sm">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">WHO</span>
                      <p className="text-base font-bold text-slate-800">{m.frequentPeople || '-'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-sky-50 shadow-sm">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">WHERE</span>
                      <p className="text-base font-bold text-slate-800">{m.frequentPlaces || '-'}</p>
                    </div>
                  </div>
                </section>

                {/* 키워드 */}
                <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col gap-6 flex-1">
                  <div className="flex items-center gap-3 text-rose-400">
                    <Heart size={18} />
                    <h3 className="text-xl font-black tracking-tight">키워드</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCategories.length > 0 ? (
                      activeCategories.map(c => (
                        <span key={c.id} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full font-bold text-sm border border-slate-100">
                          # {c.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-200 font-bold text-xs italic">선택된 키워드 없음</span>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Section (Recap Row) */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-3xl border border-rose-100 flex flex-col gap-2">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">감사</span>
                <p className="text-sm font-bold text-slate-700 leading-snug">{m.gratitude || '-'}</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">아쉬움</span>
                <p className="text-sm font-bold text-slate-600 leading-snug">{m.regret || '-'}</p>
              </div>
              <div className="p-6 bg-emerald-50/20 rounded-3xl border border-emerald-100 flex flex-col gap-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">개선</span>
                <p className="text-sm font-bold text-slate-700 leading-snug">{m.improvement || '-'}</p>
              </div>
            </div>

            {/* Achievements Section */}
            <section className="bg-white p-8 rounded-[48px] border-2 border-amber-50 shadow-sm shrink-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Trophy size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">잊지 못할 성취</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {m.achievements && m.achievements.length > 0 ? (
                  m.achievements.slice(0, 4).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 px-6 py-3 bg-slate-50/50 rounded-2xl border border-slate-50">
                      <Star size={14} className="text-amber-400" fill="currentColor" />
                      <span className="text-base font-bold text-slate-700 truncate">{a}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-slate-200 font-bold italic">기록된 성취가 없습니다.</div>
                )}
              </div>
            </section>

            <footer className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center opacity-30 shrink-0">
              <span className="text-[8px] font-black text-slate-400 tracking-[0.5em] uppercase">2025 LIFE ARCHIVE</span>
              <span className="text-[8px] font-black text-slate-400 tracking-[0.5em] uppercase">MONTH {m.month} / PAGE {m.month + 1}</span>
            </footer>
          </div>
        );
      })}
    </div>
  );
};

export default ReportPDF;
