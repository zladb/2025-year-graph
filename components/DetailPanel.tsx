
import React, { useState } from 'react';
import { MonthlyData, Category } from '../types';
import { MONTH_NAMES } from '../constants';
import { X, Plus, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';

interface DetailPanelProps {
  data: MonthlyData;
  onClose: () => void;
  onUpdate: (updatedData: MonthlyData) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ data, onClose, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...data, note: e.target.value });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...data, score: parseInt(e.target.value) || 0 });
  };

  const toggleCategory = (id: string) => {
    const updatedCategories = data.categories.map(cat => 
      cat.id === id ? { ...cat, value: !cat.value } : cat
    );
    onUpdate({ ...data, categories: updatedCategories });
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
      value: false
    };
    onUpdate({ ...data, categories: [...data.categories, newCat] });
    setNewCategoryName('');
  };

  const removeCategory = (id: string) => {
    onUpdate({ ...data, categories: data.categories.filter(c => c.id !== id) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/30 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{MONTH_NAMES[data.month - 1]}의 기록</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
          {/* Score Slider */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-500">만족도 점수</label>
              <span className="text-2xl font-bold text-rose-500">{data.score}점</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={data.score}
              onChange={handleScoreChange}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </section>

          {/* Note Area */}
          <section>
            <label className="block text-sm font-semibold text-slate-500 mb-2">무슨 일이 있었나요?</label>
            <textarea
              value={data.note}
              onChange={handleNoteChange}
              placeholder="이달의 특별한 순간들을 기록해보세요..."
              className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
            />
          </section>

          {/* Categories / Checklist */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-500">나만의 체크리스트</label>
            </div>
            <div className="space-y-2 mb-4">
              {data.categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    cat.value ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-100'
                  }`}
                >
                  <button 
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    <CheckCircle2 className={cat.value ? 'text-rose-500' : 'text-slate-200'} size={20} />
                    <span className={`text-sm ${cat.value ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                      {cat.name}
                    </span>
                  </button>
                  <button 
                    onClick={() => removeCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-300 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                placeholder="새 항목 추가..."
                className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-rose-100"
              />
              <button
                onClick={addCategory}
                className="bg-slate-800 text-white p-2 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={onClose}
            className="w-full py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
          >
            기록 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
