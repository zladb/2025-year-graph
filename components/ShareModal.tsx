
import React, { useRef, useState, useMemo } from 'react';
import { MonthlyData } from '../types';
import { X, Download, FileText, Check, Sparkles, Heart, Loader2, Star, TrendingDown } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getScoreColor } from '../constants';

interface ShareModalProps {
  data: MonthlyData[];
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 데이터 분석
  const stats = useMemo(() => {
    const average = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / 12);
    
    // 최고의 달 (가장 높은 점수)
    const best = data.reduce((prev, curr) => (curr.score >= prev.score ? curr : prev), data[0]);
    
    // 최저의 달 (가장 낮은 점수)
    const worst = data.reduce((prev, curr) => (curr.score <= prev.score ? curr : prev), data[0]);

    return { average, best, worst };
  }, [data]);

  const getGraphPath = () => {
    const width = 300;
    const height = 120;
    const padding = 20;
    const xStep = (width - padding * 2) / 11;
    let path = `M ${padding} ${height - padding - (data[0].score / 100) * (height - padding * 2)}`;
    for (let i = 1; i < data.length; i++) {
      const x = padding + i * xStep;
      const y = height - padding - (data[i].score / 100) * (height - padding * 2);
      const prevX = padding + (i - 1) * xStep;
      const prevY = height - padding - (data[i - 1].score / 100) * (height - padding * 2);
      const cp1x = prevX + xStep / 2;
      const cp2x = x - xStep / 2;
      path += ` C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    }
    return path;
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, 
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `2025_My_Life_Map.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("이미지 저장 실패:", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `🌸 나의 2025년 인생 그래프\n평균 만족도: ${stats.average}점\n가장 찬란했던 순간: ${stats.best.month}월(${stats.best.score}점)\n꿋꿋이 견뎌낸 순간: ${stats.worst.month}월(${stats.worst.score}점)\n\n#LifeGraph2025 #인생기록 #2025회고`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      {/* 닫기 버튼 (모바일에서는 상단 고정, 데스크톱에서는 모달 우측 상단 내부) */}
      <button 
        onClick={onClose} 
        className="fixed md:absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/10 md:bg-slate-100 text-white md:text-slate-400 rounded-full transition-all hover:bg-white/20 md:hover:bg-slate-200 z-[160]"
      >
        <X size={20} />
      </button>

      <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[56px] shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden md:max-h-[90vh] scrollbar-hide">
        
        {/* 미리보기 영역 */}
        <div className="bg-slate-50 p-6 md:p-12 flex items-center justify-center shrink-0 md:w-[45%] border-b md:border-b-0 md:border-r border-slate-100">
          <div 
            ref={cardRef} 
            className="bg-white w-[280px] md:w-[320px] aspect-[3/4.2] rounded-[32px] shadow-2xl overflow-hidden flex flex-col p-6 md:p-9 border border-white relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <div className="relative z-10 flex flex-col h-full">
              <header className="mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-900 text-white rounded-full text-[7px] md:text-[8px] font-black tracking-widest uppercase mb-2 md:mb-3">
                  <Sparkles size={9} fill="currentColor" />
                  Life Archive 2025
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                  나의 2025년<br/>인생 그래프
                </h3>
              </header>

              <div className="flex-1 flex flex-col justify-center mb-6 md:mb-8">
                <svg viewBox="0 0 300 120" className="w-full drop-shadow-lg">
                   <defs>
                    <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#FB7185" />
                    </linearGradient>
                  </defs>
                  <path d={getGraphPath()} fill="none" stroke="url(#modalGrad)" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <div className="flex justify-between mt-2 px-2 text-[7px] md:text-[8px] font-black text-slate-200 tracking-widest uppercase">
                  <span>Jan</span><span>Dec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                <div className="p-2.5 md:p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                  <div className="flex items-center gap-1 mb-1 text-rose-500">
                    <Star size={9} fill="currentColor" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter">최고의 달</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base md:text-xl font-black text-slate-900">{stats.best.month}월</span>
                    <span className="text-[9px] font-bold text-rose-400">{stats.best.score}점</span>
                  </div>
                </div>
                <div className="p-2.5 md:p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 mb-1 text-slate-400">
                    <TrendingDown size={9} />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter">견뎌낸 달</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base md:text-xl font-black text-slate-900">{stats.worst.month}월</span>
                    <span className="text-[9px] font-bold text-slate-400">{stats.worst.score}점</span>
                  </div>
                </div>
              </div>

              <footer className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-rose-400 fill-rose-400" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Life Bloom</span>
                </div>
                <div className="text-right">
                  <span className="block text-[6px] font-black text-slate-300 uppercase leading-none mb-0.5">Yearly Avg.</span>
                  <span className="text-xs md:text-sm font-black text-slate-800">{stats.average}점</span>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* 조작 영역 (오른쪽 패널) */}
        <div className="flex-1 p-8 md:p-14 lg:p-20 flex flex-col justify-start md:justify-center bg-white">
          <div className="mb-8 md:mb-12 text-center md:text-left">
            <h2 className="text-xl md:text-3xl lg:text-3xl font-black text-slate-900 mb-3 md:mb-4 tracking-tighter leading-tight">
              인생의 조각을 공유하세요
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-slate-400 font-bold leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
              가장 찬란했던 순간과 견뎌낸 시간들까지,<br className="hidden md:block"/> 2025년의 모든 기록을 한 장에 담았습니다.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6 max-w-sm mx-auto md:mx-0 w-full mb-10 md:mb-0">
            <button 
              onClick={handleSaveImage}
              disabled={downloading}
              className="w-full group flex items-center justify-between p-5 md:p-6 lg:p-7 bg-slate-900 text-white rounded-[24px] md:rounded-[32px] hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 active:scale-95"
            >
              <div className="text-left">
                <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Download Image</span>
                <span className="text-base md:text-lg lg:text-xl font-black">{downloading ? '준비 중...' : '이미지로 저장'}</span>
              </div>
              {downloading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
            </button>

            <button 
              onClick={copyToClipboard}
              className="w-full group flex items-center justify-between p-5 md:p-6 lg:p-7 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] md:rounded-[32px] hover:border-slate-900 transition-all active:scale-95"
            >
              <div className="text-left">
                <span className="block text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Copy Statistics</span>
                <span className="text-base md:text-lg lg:text-xl font-black">{copied ? '복사 완료!' : '텍스트로 복사'}</span>
              </div>
              {copied ? <Check size={24} className="text-emerald-500" /> : <FileText size={24} className="text-slate-200" />}
            </button>
            
            <p className="text-[10px] md:text-xs text-slate-300 font-bold text-center md:text-left">
              * 생성된 이미지는 기기의 '다운로드' 폴더에 저장됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
