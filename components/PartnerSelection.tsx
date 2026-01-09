
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS, STANDARD_SKILLS } from '../constants';
import { Star, MessageSquare, Send, Users, Sparkles, Loader2, ArrowLeft, ShieldAlert, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface PartnerSelectionProps {
  user: User;
  mode: 'learn' | 'teach';
  skill: string;
  onSelect: (partner: User) => void;
  onBack: () => void;
  onBlock: (targetUserId: string, reason: string) => void;
}

const PartnerSelection: React.FC<PartnerSelectionProps> = ({ user, mode, skill, onSelect, onBack, onBlock }) => {
  const [aiMatches, setAiMatches] = useState<User[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSemantic, setIsSemantic] = useState(false);
  const [reportingUser, setReportingUser] = useState<User | null>(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const findMatches = async () => {
      // Filter out users already blocked by the current user
      const pool = MOCK_USERS.filter(u => !user.blockedUserIds.includes(u.id));

      const exactMatches = pool.filter(p => {
        if (mode === 'learn') {
          const teachesTarget = p.skillsToTeach.some(s => s.toLowerCase() === skill.toLowerCase());
          const learnsFromMe = p.skillsToLearn.some(s => user.skillsToTeach.includes(s));
          return teachesTarget && learnsFromMe;
        } else {
          const learnsTarget = p.skillsToLearn.some(s => s.toLowerCase() === skill.toLowerCase());
          const teachesMe = p.skillsToTeach.some(s => user.skillsToLearn.includes(s));
          return learnsTarget && teachesMe;
        }
      });

      const isCustom = !STANDARD_SKILLS.includes(skill);
      
      if (exactMatches.length > 0 && !isCustom) {
        setAiMatches(exactMatches);
        setIsSemantic(false);
      } else {
        setIsAiLoading(true);
        setIsSemantic(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const partnersPool = pool.map(u => ({
            id: u.id,
            name: u.name,
            teaches: u.skillsToTeach,
            learns: u.skillsToLearn,
            bio: u.bio
          }));

          const prompt = `Identify partners who are a good match for someone wanting to ${mode === 'learn' ? 'learn' : 'teach'} "${skill}". 
          Available partners: ${JSON.stringify(partnersPool)}.
          Return ONLY a JSON array of the IDs.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            }
          });

          const matchIds: string[] = JSON.parse(response.text || "[]");
          const matchedUsers = pool.filter(u => matchIds.includes(u.id));
          setAiMatches(matchedUsers);
        } catch (error) {
          console.error("Matching failed", error);
          setAiMatches(exactMatches);
        } finally {
          setIsAiLoading(false);
        }
      }
    };

    findMatches();
  }, [skill, mode, user]);

  const handleConfirmBlock = () => {
    if (!reportReason.trim()) return;
    onBlock(reportingUser!.id, reportReason);
    setAiMatches(prev => prev.filter(u => u.id !== reportingUser!.id));
    setReportingUser(null);
    setReportReason('');
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <div className="flex justify-start">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} /> Change Skill
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Recommended Partners</h2>
              {isSemantic && (
                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border border-indigo-200 dark:border-indigo-800">
                  <Sparkles size={10} /> Smart Match
                </div>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Available partners for <span className="text-indigo-600 dark:text-indigo-400 font-black">"{skill}"</span>.
            </p>
         </div>
         {isAiLoading && (
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800 animate-pulse">
             <Loader2 size={18} className="animate-spin" />
             <span className="text-sm">Finding best matches...</span>
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiMatches.map(partner => (
          <div key={partner.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-none hover:border-indigo-200 dark:hover:border-indigo-600 transition-all flex flex-col group relative overflow-hidden">
            <div className="flex items-start justify-between mb-6 relative z-10">
              <img src={partner.avatar} className="w-20 h-20 rounded-[2rem] border-4 border-slate-50 dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-end gap-2">
                <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star size={14} fill="currentColor" /> {partner.rating}
                </div>
                <button 
                  onClick={() => setReportingUser(partner)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  title="Report and Block"
                >
                  <ShieldAlert size={18} />
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{partner.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-3 mb-6 font-medium italic">"{partner.bio}"</p>
            </div>

            <div className="mt-auto space-y-4 relative z-10">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-3 tracking-widest">Skill Set</p>
                <div className="flex flex-wrap gap-2">
                  {partner.skillsToTeach.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-700 dark:text-indigo-300 font-black uppercase tracking-tight">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onSelect(partner)}
                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 group"
              >
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>Send Request</span>
              </button>
            </div>
          </div>
        ))}
        {aiMatches.length === 0 && !isAiLoading && (
          <div className="col-span-full py-20 text-center">
             <p className="text-slate-400 font-medium">No partners found for this skill yet. Try a different skill or wait for community growth!</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportingUser && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-scaleIn border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <ShieldAlert className="text-rose-500" /> Report & Block
                 </h3>
                 <button onClick={() => setReportingUser(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={24}/></button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                You are about to block <span className="font-bold text-slate-800 dark:text-white">{reportingUser.name}</span>. They will no longer see your profile or appear in your matches.
              </p>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Reason for Report</label>
                 <textarea 
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    placeholder="e.g. Inappropriate behavior, fake skills..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-rose-500 outline-none transition-all text-slate-800 dark:text-white text-sm"
                    rows={4}
                 />
                 <button 
                  disabled={!reportReason.trim()}
                  onClick={handleConfirmBlock}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                 >
                   Confirm Block
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PartnerSelection;
