
import React, { useState } from 'react';
import { User } from '../types';
import { STANDARD_SKILLS } from '../constants';
import { 
  UserCircle, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Plus, 
  X, 
  Sparkles,
  Coins
} from 'lucide-react';

interface RegistrationProps {
  user: User;
  onComplete: (user: User) => void;
}

const Registration: React.FC<RegistrationProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState('');
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const toggleSkill = (skill: string, type: 'teach' | 'learn') => {
    const list = type === 'teach' ? teachSkills : learnSkills;
    const setter = type === 'teach' ? setTeachSkills : setLearnSkills;
    
    if (list.includes(skill)) {
      setter(list.filter(s => s !== skill));
    } else {
      setter([...list, skill]);
    }
  };

  const handleFinish = () => {
    onComplete({
      ...user,
      name: name.trim() || 'New Member',
      bio,
      skillsToTeach: teachSkills,
      skillsToLearn: learnSkills,
      credits: 5,
      rating: 5.0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 flex shrink-0">
          <div className={`h-full bg-indigo-600 transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="flex-1 p-6 lg:p-12 flex flex-col min-h-0 overflow-y-auto">
          
          {step === 1 && (
            <div className="space-y-6 lg:space-y-8 animate-fadeIn flex-1 flex flex-col">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 text-indigo-600 dark:text-indigo-400">
                  <UserCircle size={32} className="lg:size-[40px]" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">Complete Your Profile</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm lg:text-base">Let the community know your name.</p>
              </div>

              <div className="space-y-4 lg:space-y-6 flex-1">
                <div>
                  <label className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 lg:p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl lg:rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 dark:text-white text-sm lg:text-base"
                  />
                </div>
                <div>
                  <label className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Professional Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your background..."
                    rows={4}
                    className="w-full p-3 lg:p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl lg:rounded-2xl focus:border-indigo-600 outline-none transition-all text-slate-600 dark:text-slate-300 text-sm lg:text-base resize-none"
                  />
                </div>
              </div>

              <button 
                disabled={!name.trim() || !bio.trim()}
                onClick={handleNext}
                className="w-full py-4 lg:py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-base lg:text-lg rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 mt-4"
              >
                <span>Continue</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 lg:space-y-8 animate-fadeIn flex-1 flex flex-col">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 text-indigo-600">
                  <GraduationCap size={32} className="lg:size-[40px]" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">What can you teach?</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm lg:text-base">Select skills you want to share.</p>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250px] lg:max-h-[350px] p-1 scrollbar-hide">
                {STANDARD_SKILLS.map(skill => (
                  <button 
                    key={skill}
                    onClick={() => toggleSkill(skill, 'teach')}
                    className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all border-2 ${teachSkills.includes(skill) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-200'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 lg:gap-4 mt-auto pt-4">
                <button onClick={handleBack} className="flex-1 py-4 lg:py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl lg:rounded-2xl hover:bg-slate-200 transition-all text-sm lg:text-base">
                  Back
                </button>
                <button 
                  disabled={teachSkills.length === 0}
                  onClick={handleNext}
                  className="flex-[2] py-4 lg:py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm lg:text-base"
                >
                  <span>Next Step</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 lg:space-y-8 animate-fadeIn flex-1 flex flex-col">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 text-emerald-600">
                  <BookOpen size={32} className="lg:size-[40px]" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">What to learn?</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm lg:text-base">Pick skills you're interested in.</p>
              </div>

              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[200px] lg:max-h-[300px] p-1">
                {STANDARD_SKILLS.map(skill => (
                  <button 
                    key={skill}
                    onClick={() => toggleSkill(skill, 'learn')}
                    className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all border-2 ${learnSkills.includes(skill) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-200'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="bg-indigo-600 rounded-2xl p-4 lg:p-6 text-white flex items-center justify-between shadow-lg">
                 <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                       <Coins className="text-amber-300" size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Registration Bonus</p>
                       <p className="font-bold text-xs lg:text-sm">You've earned 5 credits!</p>
                    </div>
                 </div>
                 <Sparkles className="text-white opacity-40 shrink-0" size={20} />
              </div>

              <div className="flex gap-3 lg:gap-4 mt-auto pt-4">
                <button onClick={handleBack} className="flex-1 py-4 lg:py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl lg:rounded-2xl hover:bg-slate-200 transition-all text-sm lg:text-base">
                  Back
                </button>
                <button 
                  disabled={learnSkills.length === 0}
                  onClick={handleFinish}
                  className="flex-[2] py-4 lg:py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl text-sm lg:text-base"
                >
                  <span>Finish</span>
                  <CheckIcon size={20} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default Registration;
