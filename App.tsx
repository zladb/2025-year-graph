
import React, { useState, useRef } from 'react';
import { MonthlyData } from './types';
import { INITIAL_DATA } from './constants';
import LifeGraph from './components/LifeGraph';
import DiarySection from './components/DiarySection';
import ShareModal from './components/ShareModal';
import YearlyTimeline from './components/YearlyTimeline';
import MonthRecapModal from './components/MonthRecapModal';
import ReportPDF from './components/ReportPDF';
import { Share2, Heart, CalendarDays, LayoutPanelTop, Loader2, FileDown } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>(INITIAL_DATA);
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(new Date().getMonth());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recapMonthIndex, setRecapMonthIndex] = useState<number | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const diaryRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePdfReport = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPdf(true);
    
    try {
      // 1. 폰트 로드 완료 대기
      await document.fonts.ready;
      
      // 2. PDF 인스턴스 생성
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const container = pdfRef.current;
      const pages = container.querySelectorAll('.pdf-page');
      
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        
        // 3. 브라우저가 요소를 실제로 렌더링할 수 있도록 충분한 대기 시간 부여
        await new Promise(r => setTimeout(r, 1000));
        
        // 4. 고화질 캡처 (PNG 포맷 사용)
        const dataUrl = await toPng(pageElement, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: {
            // 캡처 시 스타일 강제 적용
            visibility: 'visible',
            opacity: '1',
            display: 'block'
          }
        });

        if (i > 0) pdf.addPage();
        // 5. 이미지를 PDF에 삽입 (FAST/NONE 옵션으로 화질 유지)
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'NONE');
      }
      
      pdf.save(`2025_나의_인생_그래프_리포트.pdf`);
    } catch (err) {
      console.error("PDF 생성 오류:", err);
      alert("PDF 리포트를 생성하는 중 오류가 발생했습니다. 브라우저 창을 크게 유지한 상태에서 다시 시도해 보세요.");
    } finally {
      setIsGeneratingPdf(false);
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

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800 selection:bg-rose-100 selection:text-rose-900 pb-20 md:pb-32">
      {/* Hero Section */}
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

      {/* Main Graph Area */}
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

        <div className="flex flex-col md:flex-row gap-8 justify-between items-center py-16 md:py-24 border-t border-slate-100">
          <div className="text-center md:text-left px-4">
            <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2">기록은 삶의 조각이 됩니다</h3>
            <p className="text-sm md:text-lg text-slate-400 font-bold">당신의 소중한 2025년을 간직하세요.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto px-6 md:px-0">
            <button 
              className="flex items-center justify-center px-6 md:px-8 py-4 md:py-6 bg-slate-100 text-slate-900 rounded-xl md:rounded-[32px] font-black text-sm md:text-xl hover:bg-slate-200 transition-all shadow-sm disabled:opacity-50"
              onClick={generatePdfReport}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? <Loader2 size={18} className="animate-spin mr-2" /> : <FileDown size={18} className="mr-2" />}
              상세 리포트 PDF 저장
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

      {/* Hidden PDF Container: visibility: hidden 대신 opacity와 오프스크린 전략 사용 */}
      <div 
        ref={pdfRef} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: '-5000px', // 화면 밖으로 충분히 배치
          width: '210mm',
          backgroundColor: 'white',
          zIndex: -100,
          opacity: 0.01,   // 아주 낮은 불투명도로 렌더링 유지
          pointerEvents: 'none',
          visibility: 'visible' // 반드시 visible이어야 캡처 라이브러리가 요소를 인식함
        }}
      >
        <ReportPDF data={data} averageScore={averageScore} />
      </div>
    </div>
  );
};

export default App;
