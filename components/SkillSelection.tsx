
import React, { useState } from 'react';
import { Tag, ArrowLeft, Plus, Send } from 'lucide-react';
import { STANDARD_SKILLS } from '../constants';

interface SkillSelectionProps {
  mode: 'learn' | 'teach';
  skills: string[];
  onSelect: (skill: string) => void;
  onBack: () => void;
}

const SkillSelection: React.FC<SkillSelectionProps> = ({ mode, skills, onSelect, onBack }) => {
  const [showOther, setShowOther] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  const displaySkills = Array.from(new Set([...skills, ...STANDARD_SKILLS])).slice(0, 8);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      onSelect(customSkill.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-start">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900">
          What would you like to {mode}?
        </h2>
        <p className="text-slate-500 mt-2">Select a skill from the list below or add a custom one.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displaySkills.map(skill => (
          <button 
            key={skill}
            onClick={() => onSelect(skill)}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-slate-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                 <Tag size={20} />
               </div>
               <span className="text-lg font-bold text-slate-800">{skill}</span>
            </div>
            <ArrowLeft className="rotate-180 text-slate-300 group-hover:text-indigo-600 transition-colors" />
          </button>
        ))}

        {!showOther ? (
          <button 
            onClick={() => setShowOther(true)}
            className="flex items-center justify-center gap-2 p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold"
          >
            <Plus size={20} />
            <span>Other (Add Custom Skill)</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3 animate-scaleIn">
            <div className="relative">
              <input 
                autoFocus
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter skill name..."
                className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-600 outline-none shadow-lg text-lg font-bold text-slate-800"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setShowOther(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SkillSelection;
