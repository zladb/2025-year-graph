
import React, { useState, useRef } from 'react';
import { MonthlyData, Category } from '../types';
import { MONTH_NAMES, getScoreColor } from '../constants';
import { Camera, X, Quote, Smile, Edit3, LayoutGrid, Trophy, Star, Sparkles, Plus, Users, MapPin, Heart, AlertCircle, TrendingUp } from 'lucide-react';

interface DiarySectionProps {
  data: MonthlyData;
  onUpdate: (updatedData: MonthlyData) => void;
}

const DiarySection: React.FC<DiarySectionProps> = ({ data, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof MonthlyData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const toggleCategory = (id: string) => {
    const updatedCategories = data.categories.map(cat => 
      cat.id === id ? { ...cat, value: !cat.value } : cat
    );
    onUpdate({ ...data, categories: updatedCategories });
  };

  const addCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
      value: true 
    };
    onUpdate({ ...data, categories: [...data.categories, newCat] });
    setNewCategoryName('');
  };

  const addAchievement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newAchievement.trim();
    if (!val) return;
    onUpdate({ ...data, achievements: [...(data.achievements || []), val] });
    setNewAchievement('');
  };

  const removeAchievement = (index: number) => {
    const newAchievements = [...(data.achievements || [])];
    newAchievements.splice(index, 1);
    onUpdate({ ...data, achievements: newAchievements });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const currentImages = data.images || [];
      const remainingSlots = 5 - currentImages.length;
      if (remainingSlots <= 0) return;
      
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];
      const readFiles = filesToProcess.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      const results = await Promise.all(readFiles);
      onUpdate({ ...data, images: [...currentImages, ...results] });
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(data.images || [])];
    newImages.splice(index, 1);
    onUpdate({ ...data, images: newImages });
  };

  const monthColor = getScoreColor(data.score);
  const brightGold = "#FFC107"; 

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="bg-white rounded-[32px] md:rounded-[64px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
        
        {/* 헤더 */}
        <div className="relative px-5 md:px-16 pt-10 md:pt-16 pb-6 md:pb-12 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-10">
              <div className="relative">
                <div 
                  className="w-20 h-20 md:w-32 md:h-32 rounded-[24px] md:rounded-[44px] flex flex-col items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden backdrop-blur-xl border border-white"
                  style={{ 
                    background: `linear-gradient(135deg, ${monthColor}15 0%, ${monthColor}35 100%)`,
                    boxShadow: `0 15px 30px -5px ${monthColor}25`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                  <span className="text-[8px] md:text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase mb-0.5 md:mb-1 z-10">Month</span>
                  <span className="text-4xl md:text-7xl font-black z-10 leading-none" style={{ color: monthColor }}>{data.month}</span>
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-1 md:mb-2">
                  <span className="text-[10px] md:text-sm font-black text-slate-300 tracking-widest uppercase">{MONTH_NAMES[data.month - 1]}의 조각</span>
                  <Sparkles size={14} className="text-amber-400" />
                </div>
                <div className="relative group w-full max-w-2xl px-4 md:px-0">
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    onFocus={() => setIsEditingTitle(true)}
                    onBlur={() => setIsEditingTitle(false)}
                    placeholder="이달의 제목"
                    className="w-full bg-transparent border-none text-xl md:text-5xl font-black text-slate-900 text-center md:text-left tracking-tight focus:ring-0 placeholder:text-slate-100 transition-all p-0 pb-1 md:pb-2"
                  />
                  <div 
                    className={`absolute bottom-0 left-0 h-1 transition-all duration-700 hidden md:block ${isEditingTitle ? 'w-full' : 'w-16 group-hover:w-32'}`}
                    style={{ backgroundColor: monthColor }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center px-6 md:px-10 py-4 md:py-8 bg-white/80 backdrop-blur-md rounded-[24px] md:rounded-[40px] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] border border-white shrink-0 relative overflow-hidden self-center md:self-auto">
              <span className="text-[8px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1 relative z-10">Satisfaction</span>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl md:text-6xl font-black text-slate-900 leading-none">{data.score}</span>
                <span className="text-sm md:text-xl font-bold text-slate-200">/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 md:px-20 pb-12 md:pb-24 space-y-10 md:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* 왼쪽 컬럼: 사진과 메인 노트 */}
            <div className="lg:col-span-7 space-y-10 md:space-y-16">
              <section>
                <div className="flex items-center justify-between mb-5 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-12 md:h-12 bg-sky-50 rounded-lg md:rounded-2xl flex items-center justify-center text-sky-500 shadow-sm">
                      <LayoutGrid size={18} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">기억의 전시장</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                  {(data.images || []).map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`relative aspect-[3/4] rounded-2xl md:rounded-[32px] overflow-hidden shadow-lg group transition-all duration-700 border-[3px] md:border-[6px] border-white ${idx % 2 === 0 ? 'rotate-1 md:rotate-2' : '-rotate-1 md:-rotate-2'}`}
                    >
                      <img src={img} alt={`Exhibition ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button onClick={() => removeImage(idx)} className="w-8 h-8 md:w-12 md:h-12 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                          <X size={16} className="md:w-6 md:h-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(data.images || []).length < 5 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[3/4] rounded-2xl md:rounded-[40px] bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all border border-slate-100 group overflow-hidden relative"
                    >
                      <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 mb-2 z-10">
                        <Camera size={20} className="md:w-8 md:h-8 text-slate-300 group-hover:text-slate-900 transition-colors" />
                      </div>
                      <span className="font-black text-[9px] md:text-xs tracking-[0.2em] uppercase z-10 group-hover:text-slate-900 transition-colors">Add Moments</span>
                    </button>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
              </section>

              <section>
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-rose-50 rounded-lg md:rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                    <Quote size={18} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">깊은 회고의 기록</h3>
                </div>
                <div className="relative group">
                   <textarea
                    value={data.note}
                    onChange={(e) => handleFieldChange('note', e.target.value)}
                    placeholder="이달을 마무리하며 내 자신에게 어떤 이야기를 들려주고 싶나요?..."
                    className="w-full h-40 md:h-64 p-5 md:p-10 bg-slate-50/50 border border-transparent rounded-[24px] md:rounded-[48px] text-base md:text-xl font-medium leading-relaxed scrollbar-hide focus:ring-0 focus:bg-white transition-all"
                  />
                </div>
              </section>
            </div>

            {/* 오른쪽 컬럼: 하이라이트, 키워드 */}
            <div className="lg:col-span-5 space-y-8 md:space-y-12">
               {/* 이달의 하이라이트 */}
               <section className="bg-slate-50/50 p-6 md:p-10 rounded-[32px] md:rounded-[56px] border border-slate-100">
                <div className="space-y-6 md:space-y-8">
                   <div className="flex items-center gap-3 md:gap-4 mb-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-100/50 rounded-lg md:rounded-xl flex items-center justify-center text-sky-500">
                      <Sparkles size={16} className="md:w-5 md:h-5" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">하이라이트</h3>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 md:left-5 text-slate-300">
                        <Users size={18} />
                      </div>
                      <input
                        type="text"
                        value={data.frequentPeople || ''}
                        onChange={(e) => handleFieldChange('frequentPeople', e.target.value)}
                        placeholder="자주 만난 사람"
                        className="w-full pl-11 md:pl-14 pr-5 py-3.5 md:py-5 bg-white border border-transparent rounded-xl md:rounded-[24px] font-bold text-sm md:text-lg shadow-sm focus:ring-0 focus:border-sky-100 transition-all placeholder:text-slate-200"
                      />
                    </div>
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 md:left-5 text-slate-300">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        value={data.frequentPlaces || ''}
                        onChange={(e) => handleFieldChange('frequentPlaces', e.target.value)}
                        placeholder="자주 간 장소"
                        className="w-full pl-11 md:pl-14 pr-5 py-3.5 md:py-5 bg-white border border-transparent rounded-xl md:rounded-[24px] font-bold text-sm md:text-lg shadow-sm focus:ring-0 focus:border-rose-100 transition-all placeholder:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </section>

               {/* 나의 키워드 */}
               <section className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[56px] border border-slate-50 shadow-sm">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                      <Smile size={18} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">나의 키워드</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {data.categories.filter(c => c.value).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-black text-xs md:text-base text-slate-700 bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-slate-200"
                      >
                        # {cat.name}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={addCategory} className="relative flex items-center group/input">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="새 키워드 추가"
                      className="w-full px-4 md:px-6 py-3 md:py-5 bg-slate-50/50 border border-transparent rounded-lg md:rounded-[24px] font-bold text-sm md:text-lg focus:ring-0 focus:bg-white focus:border-slate-100 transition-all placeholder:text-slate-200 pr-10 md:pr-16"
                    />
                    <button 
                      type="submit" 
                      onClick={(e) => { e.preventDefault(); addCategory(); }}
                      className="absolute right-1.5 md:right-2 w-7 h-7 md:w-12 md:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-all"
                    >
                      <Plus size={16} className="md:w-6 md:h-6" />
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>

          {/* 세분화된 회고 섹션 - '깊은 회고의 기록' 스타일로 통일 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-4">
             <section className="flex flex-col">
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-rose-50 rounded-lg md:rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                    <Heart size={18} className="md:w-6 md:h-6" fill="currentColor" />
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">감사한 점</h4>
                </div>
                <textarea
                  value={data.gratitude || ''}
                  onChange={(e) => handleFieldChange('gratitude', e.target.value)}
                  placeholder="감사한 것을 떠올려보세요"
                  className="w-full h-32 md:h-48 p-6 md:p-8 bg-slate-50/50 border border-transparent rounded-[24px] md:rounded-[40px] text-base md:text-lg font-medium leading-relaxed focus:ring-0 focus:bg-white transition-all resize-none shadow-sm"
                />
             </section>

             <section className="flex flex-col">
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-slate-100/80 rounded-lg md:rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                    <AlertCircle size={18} className="md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">아쉬웠던 점</h4>
                </div>
                <textarea
                  value={data.regret || ''}
                  onChange={(e) => handleFieldChange('regret', e.target.value)}
                  placeholder="솔직하게 털어놓으세요"
                  className="w-full h-32 md:h-48 p-6 md:p-8 bg-slate-50/50 border border-transparent rounded-[24px] md:rounded-[40px] text-base md:text-lg font-medium leading-relaxed focus:ring-0 focus:bg-white transition-all resize-none shadow-sm"
                />
             </section>

             <section className="flex flex-col">
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-emerald-50 rounded-lg md:rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <TrendingUp size={18} className="md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">개선할 점</h4>
                </div>
                <textarea
                  value={data.improvement || ''}
                  onChange={(e) => handleFieldChange('improvement', e.target.value)}
                  placeholder="내일을 위한 약속"
                  className="w-full h-32 md:h-48 p-6 md:p-8 bg-slate-50/50 border border-transparent rounded-[24px] md:rounded-[40px] text-base md:text-lg font-medium leading-relaxed focus:ring-0 focus:bg-white transition-all resize-none shadow-sm"
                />
             </section>
          </div>

          {/* 성취 섹션 */}
          <section className="relative p-6 md:p-14 rounded-[32px] md:rounded-[64px] overflow-hidden group border border-slate-100 bg-white/50 backdrop-blur-sm shadow-sm transition-all">
            <div className="relative z-10">
              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                <div 
                  className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] flex items-center justify-center shadow-lg border border-white"
                  style={{ backgroundColor: `${brightGold}15`, color: brightGold }}
                >
                  <Trophy size={24} className="md:w-10 md:h-10" />
                </div>
                <div>
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest block mb-0.5" style={{ color: `${brightGold}CC` }}>Unforgettable achievements</span>
                  <h3 className="text-xl md:text-4xl font-black text-slate-800 tracking-tight leading-none">잊지 못할 성취</h3>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
                {(data.achievements || []).length > 0 ? (
                  (data.achievements || []).map((achievement, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between bg-white/80 backdrop-blur-sm px-6 md:px-10 py-4 md:py-7 rounded-2xl md:rounded-[32px] border-l-4 shadow-sm"
                      style={{ borderLeftColor: brightGold }}
                    >
                      <div className="flex items-center gap-3 md:gap-6 flex-1 pr-2 min-w-0">
                        <Star size={16} className="md:w-6 md:h-6 shrink-0" style={{ color: brightGold, fill: `${brightGold}33` }} />
                        <span className="font-black text-slate-700 text-sm md:text-xl leading-snug truncate">{achievement}</span>
                      </div>
                      <button 
                        onClick={() => removeAchievement(idx)} 
                        className="text-slate-200 hover:text-rose-500 transition-all p-1.5"
                      >
                        <X size={18} className="md:w-6 md:h-6" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 md:py-20 bg-slate-50/30 rounded-[24px] md:rounded-[40px] border border-dashed border-amber-200">
                    <p className="font-black text-amber-200 text-sm md:text-2xl">당신의 황금빛 순간들을 기록해주세요.</p>
                  </div>
                )}
              </div>

              <form onSubmit={addAchievement} className="relative flex items-center max-w-4xl mx-auto">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="이달의 한 조각을 기록하세요"
                  className="w-full pl-6 pr-14 md:pl-16 md:pr-32 py-4 md:py-8 bg-white border border-slate-100 rounded-2xl md:rounded-[44px] text-base md:text-2xl font-black text-slate-800 focus:ring-4 focus:ring-amber-50 focus:border-amber-100 transition-all shadow-inner"
                />
                <button 
                  type="submit" 
                  onClick={(e) => { e.preventDefault(); addAchievement(); }}
                  className="absolute right-2 md:right-4 w-10 h-10 md:w-20 md:h-20 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                  <Plus size={24} className="md:w-10 md:h-10" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DiarySection;
