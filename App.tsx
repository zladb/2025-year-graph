
import React, { useState, useRef, useEffect } from 'react';
import { MonthlyData } from './types';
import { INITIAL_DATA } from './constants';
import LifeGraph from './components/LifeGraph';
import DiarySection from './components/DiarySection';
import ShareModal from './components/ShareModal';
import YearlyTimeline from './components/YearlyTimeline';
import MonthRecapModal from './components/MonthRecapModal';
import ReportPDF from './components/ReportPDF';
import { Share2, Heart, CalendarDays, LayoutPanelTop, Loader2, FileDown, CloudCheck, CloudUpload, Database, Download, Upload } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { saveData, loadData } from './services/db';

const App: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>(INITIAL_DATA);
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(new Date().getMonth());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recapMonthIndex, setRecapMonthIndex] = useState<number | null>(null);
  const [pdfProgress, setPdfProgress] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  
  const isGeneratingPdf = pdfProgress !== null;
  const diaryRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  // Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout to fix compilation error in browser environments
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const initData = async () => {
      try {
        const saved = await loadData();
        if (saved) {
          setData(saved);
        }
      } catch (err) {
        console.error("DB 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // 데이터 변경 시 자동 저장 (Debounced)
  useEffect(() => {
    if (isLoading) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveData(data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error("저장 실패:", err);
        setSaveStatus('idle');
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [data, isLoading]);

  const exportToJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifegraph_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length === 12) {
          setData(json);
          alert("데이터를 성공적으로 불러왔습니다.");
        } else {
          throw new Error("올바른 데이터 형식이 아닙니다.");
        }
      } catch (err) {
        alert("파일을 읽는 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
  };

  const generatePdfReport = async () => {
    if (!pdfRef.current) return;
    setPdfProgress("초고화질 리소스 렌더링 중...");
    
    try {
      await document.fonts.ready;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const container = pdfRef.current;
      const pages = container.querySelectorAll('.pdf-page');
      const totalPages = pages.length;

      const filter = (node: HTMLElement) => {
        if (node.tagName === 'LINK') return false;
        return true;
      };
      
      for (let i = 0; i < totalPages; i++) {
        setPdfProgress(`${i + 1} / ${totalPages} 페이지 고화질 생성 중...`);
        const pageElement = pages[i] as HTMLElement;
        
        await new Promise(r => setTimeout(r, 1200));
        
        const dataUrl = await toJpeg(pageElement, {
          quality: 1.0,
          pixelRatio: 3.0,
          backgroundColor: '#ffffff',
          cacheBust: true,
          filter: filter as any,
          fontEmbedCSS: '',
          style: { visibility: 'visible', opacity: '1', display: 'block' }
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'MEDIUM');
      }
      
      setPdfProgress("최종 파일 구성 중...");
      
      const pdfBlob = pdf.output('blob');
      const filename = `2025_나의_인생_리포트_고화질_${new Date().getTime()}.pdf`;
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      }, 2500);

    } catch (err) {
      console.error("PDF 생성 실패:", err);
      alert("생성 중 오류가 발생했습니다. 브라우저 메모리 확보 후 다시 시도해 주세요.");
    } finally {
      setPdfProgress(null);
    }
  };

  const handleUpdateScore = (index: number, score: number) => {
    const newData = [...data];
    newData[index].score = score;
    setData(newData);
  };

  const handleUpdateMonthData = (updatedData: MonthlyData) => {
    const newData = [...data];
    const index = updatedData.month - 1;
    newData[index] = updatedData;
    setData(newData);
  };

  const averageScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / 12);

  const getEmotionalMessage = () => {
    if (averageScore >= 85) return "정말 눈부시게 빛나는 한 해를 완성해가고 계시네요.";
    if (averageScore >= 70) return "행복의 조각들이 곳곳에 묻어나는 따뜻한 여정입니다.";
    if (averageScore >= 50) return "잔잔한 평화와 성장이 함께하는 소중한 한 해군요.";
    if (averageScore >= 30) return "가끔은 흔들려도, 묵묵히 나아가는 당신이 아름답습니다.";
    return "힘든 시간들 속에서도 잃지 않은 당신만의 빛을 응원합니다.";
  };

  const handleMonthSelect = (idx: number) => {
    setActiveMonthIndex(idx);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        diaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-rose-500 mb-4" size={48} />
        <p className="font-black text-slate-800 tracking-tighter">당신의 소중한 기록을 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800 selection:bg-rose-100 selection:text-rose-900 pb-20 md:pb-32">
      {/* 고정된 저장 상태 표시줄 */}
      <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 shadow-xl transition-all">
        {saveStatus === 'saving' ? (
          <>
            <CloudUpload size={16} className="text-sky-500 animate-pulse" />
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Saving...</span>
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <CloudCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Auto Saved</span>
          </>
        ) : (
          <>
            <Database size={16} className="text-slate-300" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ready</span>
          </>
        )}
      </div>

      <section className="relative pt-12 md:pt-24 pb-10 md:pb-16 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-7xl font-black tracking-tighter mb-4 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 leading-[1.2]">
          나의 <span className="text-rose-500 underline decoration-2 md:decoration-8 decoration-rose-100 underline-offset-4 md:underline-offset-8">2025</span> 인생 그래프
        </h1>
        <p className="text-sm md:text-xl text-slate-400 font-semibold leading-relaxed max-w-2xl mx-auto mb-10 md:mb-16">
          지난 1년의 인생 그래프를 그려보세요.<br className="hidden md:block"/>
          포인트를 위아래로 드래그하여 만족도를 조절하고, 기록을 채워보세요.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-16 border-y border-slate-100 py-8 md:py-12">
          <div className="text-center px-4 md:px-8">
            <p className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest mb-1 md:mb-2">Yearly Satisfaction</p>
            <div className="flex items-baseline justify-center gap-1 md:gap-2">
              <span className="text-4xl md:text-6xl font-black text-slate-800">{averageScore}</span>
              <span className="text-lg md:text-2xl font-bold text-slate-300">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left sm:border-l border-slate-100 sm:pl-16 flex flex-col justify-center">
            <p className="text-xs md:text-sm font-black text-rose-400 mb-1 md:mb-2 flex items-center justify-center sm:justify-start">
              <Heart size={14} className="mr-2 fill-rose-400" /> 올해를 되돌아보며
            </p>
            <p className="text-sm md:text-lg font-bold text-slate-500 italic leading-relaxed">
              "{getEmotionalMessage()}"
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-24 overflow-visible">
        <div className="bg-white rounded-[24px] md:rounded-[64px] p-5 md:p-16 shadow-2xl shadow-slate-200/30 border border-slate-50 relative overflow-visible">
          <div className="flex justify-between items-center mb-6 md:mb-12 px-2">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center">
                <CalendarDays className="text-slate-900 w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <span className="text-[9px] md:text-sm font-black text-slate-400 block uppercase">2025 Journey</span>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg font-black text-[9px] md:text-sm uppercase tracking-tighter md:tracking-normal">
              포인트를 위아래로 조절해보세요
            </div>
          </div>

          <div className="relative min-h-[280px] md:min-h-[450px]">
             <LifeGraph 
              data={data} 
              onUpdateScore={handleUpdateScore} 
              onMonthClick={handleMonthSelect}
              activeMonth={activeMonthIndex}
            />
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
        <section ref={diaryRef} className="scroll-mt-10">
          <DiarySection data={data[activeMonthIndex]} onUpdate={handleUpdateMonthData} />
        </section>

        <section className="scroll-mt-10">
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white">
              <LayoutPanelTop size={20} />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900">연간 타임라인</h2>
          </div>
          <YearlyTimeline data={data} onMonthClick={(idx) => setRecapMonthIndex(idx)} />
        </section>

        {/* 데이터 관리 섹션 */}
        <div className="bg-white p-8 md:p-16 rounded-[32px] md:rounded-[64px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">데이터 백업 및 관리</h3>
            <p className="text-sm text-slate-400 font-bold">브라우저를 변경하거나 기기를 옮길 때 사용하세요.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={exportToJson}
              className="flex items-center px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all"
            >
              <Download size={18} className="mr-2" /> 백업 파일로 저장 (.json)
            </button>
            <label className="flex items-center px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all cursor-pointer">
              <Upload size={18} className="mr-2" /> 데이터 불러오기
              <input type="file" className="hidden" accept=".json" onChange={importFromJson} />
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-between items-center py-16 md:py-24 border-t border-slate-100">
          <div className="text-center md:text-left px-4">
            <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2">기록은 삶의 조각이 됩니다</h3>
            <p className="text-sm md:text-lg text-slate-400 font-bold">당신의 소중한 2025년을 간직하세요.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto px-6 md:px-0">
            <button 
              className="flex items-center justify-center px-6 md:px-8 py-4 md:py-6 bg-slate-100 text-slate-900 rounded-xl md:rounded-[32px] font-black text-sm md:text-xl hover:bg-slate-200 transition-all shadow-sm disabled:opacity-50 min-w-[240px]"
              onClick={generatePdfReport}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? <Loader2 size={18} className="animate-spin mr-2" /> : <FileDown size={18} className="mr-2" />}
              {isGeneratingPdf ? pdfProgress : "고화질 리포트 PDF 저장"}
            </button>
            <button 
              className="flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[32px] font-black text-sm md:text-xl hover:bg-rose-500 transition-all shadow-xl"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 size={18} className="mr-2" />
              그래프 공유
            </button>
          </div>
        </div>
      </div>

      {isShareModalOpen && <ShareModal data={data} onClose={() => setIsShareModalOpen(false)} />}
      {recapMonthIndex !== null && (
        <MonthRecapModal
          data={data}
          currentIndex={recapMonthIndex}
          onPrev={() => setRecapMonthIndex(p => p !== null && p > 0 ? p - 1 : p)}
          onNext={() => setRecapMonthIndex(p => p !== null && p < 11 ? p + 1 : p)}
          isFirst={recapMonthIndex === 0}
          isLast={recapMonthIndex === 11}
          onClose={() => setRecapMonthIndex(null)}
        />
      )}

      <div 
        ref={pdfRef} 
        aria-hidden="true"
        style={{ 
          position: 'fixed',
          top: '-10000px', 
          left: '0',
          width: '210mm',
          backgroundColor: 'white',
          zIndex: -9999,
          opacity: 1, 
          pointerEvents: 'none',
          visibility: 'visible',
          display: 'block'
        }}
      >
        <ReportPDF data={data} averageScore={averageScore} />
      </div>
    </div>
  );
};

export default App;
