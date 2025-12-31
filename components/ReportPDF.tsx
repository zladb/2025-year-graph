
import React, { useMemo } from 'react';
import { MonthlyData } from '../types';
import { getScoreColor } from '../constants';
import { Star, Users, MapPin, Trophy, Quote, Heart, AlertCircle, TrendingUp, Sparkles, LayoutPanelTop } from 'lucide-react';

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
    <div className="flex flex-col bg-white" style={{ background: '#ffffff' }}>
      {/* 1페이지: 연간 요약 */}
      <div 
        className="pdf-page w-[210mm] h-[297mm] p-16 flex flex-col items-center relative overflow-hidden bg-white" 
        style={{ background: '#ffffff', width: '210mm', height: '297mm', minHeight: '297mm' }}
      >
        <div className="mt-32 mb-16 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-tight inline-block">
            나의 <span className="text-rose-500 relative">2025<span className="absolute bottom-2 left-0 w-full h-3 bg-rose-100 -z-10"></span></span> 인생 그래프
          </h1>
        </div>

        <div className="w-full max-w-3xl mt-12 border-t border-slate-100 pt-16 flex items-center justify-center gap-16">
          <div className="shrink-0 text-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">YEARLY SATISFACTION</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-8xl font-black text-slate-900 leading-none">{averageScore}</span>
              <span className="text-2xl font-bold text-slate-200">/ 100</span>
            </div>
          </div>
          <div className="h-24 w-px bg-slate-100" />
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4 text-rose-500">
              <Heart size={24} fill="currentColor" />
              <span className="text-xl font-black">올해를 되돌아보며</span>
            </div>
            <p className="text-3xl font-bold text-slate-500 italic leading-snug">
              "{getEmotionalMessage(averageScore)}"
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mt-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-slate-900 rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">연간 만족도 추이</h2>
          </div>
          <div className="bg-slate-50 rounded-[48px] p-12 border border-slate-100 relative">
            <svg width="600" height="240" viewBox="0 0 600 240" className="overflow-visible mx-auto">
              <defs>
                <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#FB7185" />
                </linearGradient>
              </defs>
              <path d={getGraphPath(600, 240, 40)} fill="none" stroke="url(#pdfGrad)" strokeWidth="6" strokeLinecap="round" />
              {data.map((d, i) => {
                const xStep = (600 - 80) / 11;
                const x = 40 + i * xStep;
                const y = 240 - 40 - (d.score / 100) * (240 - 80);
                const isBest = d.month === stats.best.month;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isBest ? "8" : "4"} fill="white" stroke={getScoreColor(d.score)} strokeWidth="3" />
                    <text x={x} y="230" textAnchor="middle" fontSize="10" fontWeight="900" fill="#cbd5e1">{d.month}월</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <footer className="mt-auto pb-10 text-center">
          <p className="text-slate-200 text-xs font-black tracking-[1em] uppercase">LIFE GRAPH ARCHIVE 2025</p>
        </footer>
      </div>

      {/* 월별 페이지 */}
      {data.map((m) => {
        const color = getScoreColor(m.score);
        const hasImages = m.images && m.images.length > 0;
        const hasNote = m.note && m.note.trim().length > 0;
        const activeCategories = m.categories.filter(c => c.value);
        const hasKeywords = activeCategories.length > 0;
        const hasAchievements = m.achievements && m.achievements.length > 0;
        const hasReflections = m.gratitude || m.regret || m.improvement;

        return (
          <div 
            key={m.month} 
            className="pdf-page w-[210mm] h-[297mm] p-16 flex flex-col bg-white border-b border-slate-100 relative overflow-hidden"
            style={{ background: '#ffffff', width: '210mm', height: '297mm', minHeight: '297mm' }}
          >
            <header className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-6">
                <div 
                  className="w-20 h-20 rounded-[24px] flex flex-col items-center justify-center border border-white shadow-xl"
                  style={{ backgroundColor: `${color}15`, color: color }}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-0.5">Month</span>
                  <span className="text-4xl font-black leading-none">{m.month}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-rose-400">
                    <span className="text-xs font-black tracking-[0.3em] uppercase">{m.month}월의 조각</span>
                    <Sparkles size={14} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{m.title || "이달의 제목"}</h2>
                </div>
              </div>
              <div className="bg-white px-8 py-4 rounded-[32px] shadow-sm border border-slate-50 text-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">SATISFACTION</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-slate-900">{m.score}</span>
                  <span className="text-lg font-bold text-slate-200">/100</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-12 gap-10 mb-8 flex-1 items-start">
              <div className="col-span-7 space-y-10 h-full flex flex-col">
                {/* 이미지 복구: 기억의 전시장 */}
                {hasImages && (
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 shadow-sm">
                        <LayoutPanelTop size={18} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">기억의 전시장</h3>
                    </div>
                    <div className="flex gap-4">
                      {m.images.slice(0, 3).map((img, i) => (
                        <div key={i} className="aspect-[3/4] h-40 rounded-[20px] overflow-hidden border-[4px] border-white shadow-lg bg-slate-50">
                          <img src={img} className="w-full h-full object-cover" alt="memory" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 노트/회고 섹션: 이미지 유무에 따라 높이 유동적 */}
                <section className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                      <Quote size={18} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">깊은 회고의 기록</h3>
                  </div>
                  <div className={`p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 italic text-lg font-medium text-slate-600 leading-relaxed flex-1 ${!hasImages ? 'min-h-[400px]' : 'min-h-[200px]'}`}>
                    {hasNote ? `"${m.note}"` : "작성된 회고 내용이 없습니다."}
                  </div>
                </section>
              </div>

              <div className="col-span-5 space-y-8">
                <section className="bg-slate-50/30 p-8 rounded-[40px] border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">하이라이트</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
                      <Users size={20} className="text-slate-300" />
                      <div>
                        <span className="text-[8px] font-black text-slate-300 uppercase block tracking-widest mb-0.5">WHO</span>
                        <p className="text-base font-bold text-slate-700">{m.frequentPeople || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
                      <MapPin size={20} className="text-slate-300" />
                      <div>
                        <span className="text-[8px] font-black text-slate-300 uppercase block tracking-widest mb-0.5">WHERE</span>
                        <p className="text-base font-bold text-slate-700">{m.frequentPlaces || '-'}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {hasKeywords && (
                  <section className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <Heart size={20} />
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">나의 키워드</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeCategories.map((cat) => (
                        <div key={cat.id} className="px-4 py-2 bg-slate-50 rounded-xl text-sm font-black text-slate-600 border border-slate-100">
                          # {cat.name}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="mt-auto space-y-8">
              {hasReflections && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 rounded-[24px] border bg-rose-50/20 border-rose-50 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-rose-400">
                      <Heart size={16} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-widest">감사한 점</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed min-h-[60px]">{m.gratitude || '-'}</p>
                  </div>
                  <div className="p-6 rounded-[24px] border bg-slate-50 border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-slate-400">
                      <AlertCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">아쉬웠던 점</span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed min-h-[60px]">{m.regret || '-'}</p>
                  </div>
                  <div className="p-6 rounded-[24px] border bg-emerald-50/20 border-emerald-50 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-emerald-500">
                      <TrendingUp size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">개선할 점</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed min-h-[60px]">{m.improvement || '-'}</p>
                  </div>
                </div>
              )}

              {hasAchievements && (
                <section className="bg-white p-8 rounded-[40px] border border-amber-100 shadow-lg relative min-h-[120px]">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-md shrink-0">
                      <Trophy size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.4em] block">ACHIEVEMENTS</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">잊지 못할 성취</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {m.achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-100 rounded-[16px] shadow-sm max-w-full">
                        <Star size={12} className="text-amber-400 shrink-0" fill="currentColor" />
                        <span className="text-sm font-black text-slate-800 leading-snug break-words">{a}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <footer className="mt-12 pt-6 border-t border-slate-50 flex justify-between items-center opacity-30">
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">2025 Life Graph Archive</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {m.month + 1} / 13</span>
            </footer>
          </div>
        );
      })}
    </div>
  );
};

export default ReportPDF;
