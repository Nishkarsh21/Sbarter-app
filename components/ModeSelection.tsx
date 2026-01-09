
import React from 'react';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

interface ModeSelectionProps {
  onSelect: (mode: 'learn' | 'teach') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-10 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-2xl lg:text-4xl font-black text-slate-900 mb-2 lg:mb-4">Welcome! What would you like to do today?</h1>
        <p className="text-slate-500 text-sm lg:text-lg">Select an option below to continue with the SkillBarter network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        <button 
          onClick={() => onSelect('learn')}
          className="group bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border-2 border-transparent hover:border-indigo-600 shadow-xl transition-all text-left flex flex-col justify-between min-h-[260px] lg:h-[400px]"
        >
          <div className="w-14 h-14 lg:w-20 lg:h-20 bg-indigo-100 text-indigo-600 rounded-2xl lg:rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4 lg:mb-0">
            <BookOpen size={28} className="lg:size-[40px]" />
          </div>
          <div>
            <h3 className="text-xl lg:text-3xl font-bold text-slate-900 mb-2 lg:mb-4">I want to Learn</h3>
            <p className="text-slate-500 text-sm lg:text-lg leading-relaxed mb-4 lg:mb-0">Find experts who can teach you new skills in exchange for your knowledge.</p>
          </div>
          <div className="flex items-center text-indigo-600 font-bold text-base lg:text-lg mt-auto">
            <span>Get Started</span>
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform lg:size-[20px]" />
          </div>
        </button>

        <button 
          onClick={() => onSelect('teach')}
          className="group bg-slate-900 p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border-2 border-transparent hover:border-emerald-500 shadow-xl transition-all text-left flex flex-col justify-between min-h-[260px] lg:h-[400px]"
        >
          <div className="w-14 h-14 lg:w-20 lg:h-20 bg-white/10 text-emerald-400 rounded-2xl lg:rounded-3xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-4 lg:mb-0">
            <GraduationCap size={28} className="lg:size-[40px]" />
          </div>
          <div className="text-white">
            <h3 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-4">I want to Teach</h3>
            <p className="text-slate-400 text-sm lg:text-lg leading-relaxed mb-4 lg:mb-0">Help others learn by sharing your expertise and earning credits in return.</p>
          </div>
          <div className="flex items-center text-emerald-400 font-bold text-base lg:text-lg mt-auto">
            <span>Find Students</span>
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform lg:size-[20px]" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
