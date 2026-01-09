
import React, { useState, useEffect } from 'react';
import { User, BarterMatch } from '../types';
import { MOCK_USERS } from '../constants';
import { Video, Star, Award, TrendingUp, Sparkles, Loader2, Check, X, Bell, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface DashboardProps {
  user: User;
  onStartSession: (match: BarterMatch) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartSession }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [rejectingMatchId, setRejectingMatchId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Provide a 1-sentence strategic advice for the user based on their skills and the community. User teaches ${user.skillsToTeach.join(', ')} and wants to learn ${user.skillsToLearn.join(', ')}. Keep it very brief and professional.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
        setAiInsight(response.text || "Start exchanging skills to see tips!");
      } catch (e) {
        setAiInsight("Start bartering to see personalized tips!");
      } finally {
        setIsLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [user]);

  const [incomingRequests, setIncomingRequests] = useState<BarterMatch[]>([
    {
      id: 'r1',
      partner: MOCK_USERS[3], 
      skillOffered: 'Public Speaking',
      skillRequested: 'Python',
      status: 'pending',
      requestMessage: "I would like to learn Python from you."
    }
  ]);

  const activeMatches: BarterMatch[] = [
    {
      id: 'm1',
      partner: MOCK_USERS[1],
      skillOffered: 'Python',
      skillRequested: 'Video Editing',
      status: 'active',
      googleMeetLink: 'https://meet.google.com/abc-defg-hij'
    }
  ];

  const handleAccept = (matchId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== matchId));
    alert("Request accepted! A Google Meet link has been generated for your session.");
  };

  const handleReject = (matchId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setIncomingRequests(prev => prev.filter(r => r.id !== matchId));
    setRejectingMatchId(null);
    setRejectionReason('');
    alert("Request declined.");
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn pb-10">
      {/* System Insight Card */}
      <div className="bg-indigo-600 rounded-2xl p-5 lg:p-6 text-white shadow-lg flex items-center gap-4 relative overflow-hidden">
        <div className="p-2 lg:p-3 bg-white/10 rounded-xl shrink-0"><Sparkles className="text-amber-300" size={20} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] lg:text-[10px] uppercase font-black tracking-widest text-indigo-200 mb-0.5">
            System Insight
          </p>
          {isLoadingInsight ? (
            <div className="flex items-center gap-2 text-[10px] opacity-70">
              <Loader2 size={12} className="animate-spin" /> Analyzing...
            </div>
          ) : (
            <p className="text-xs lg:text-sm font-medium leading-tight truncate-multiline">{aiInsight}</p>
          )}
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none -mr-4 -mt-4"><Sparkles size={80} className="lg:size-[120px]" /></div>
      </div>

      {/* Stats Cards - Corrected data from state */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs uppercase tracking-wider mb-2">Total Credits</h3>
          <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">{user.credits}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs uppercase tracking-wider mb-2">Lessons Done</h3>
          <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">{user.sessionsCompleted}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs uppercase tracking-wider mb-2">Active Matches</h3>
          <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">{activeMatches.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs uppercase tracking-wider mb-2">Rating</h3>
          <div className="flex items-center gap-1">
             <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100">{user.rating.toFixed(1)}</p>
             <Star className="text-amber-400 fill-amber-400" size={20} />
          </div>
        </div>
      </div>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="animate-slideIn">
          <h3 className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-indigo-600" /> New Barter Requests
          </h3>
          <div className="space-y-3 lg:space-y-4">
            {incomingRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 lg:p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={req.partner.avatar} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-indigo-50 dark:border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm lg:text-base truncate">{req.partner.name}</h4>
                    <p className="text-[10px] lg:text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase truncate">Wants to learn: {req.skillRequested}</p>
                  </div>
                </div>
                
                {rejectingMatchId === req.id ? (
                  <div className="flex w-full gap-2 animate-fadeIn">
                    <input 
                      autoFocus
                      type="text" 
                      value={rejectionReason} 
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Reason for declining..." 
                      className="flex-1 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={() => handleReject(req.id)} className="bg-rose-600 text-white px-3 rounded-xl hover:bg-rose-700 transition-colors shrink-0"><Check size={16}/></button>
                    <button onClick={() => setRejectingMatchId(null)} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 rounded-xl hover:bg-slate-200 transition-colors shrink-0"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 md:flex-none bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                    >
                      <Check size={16}/> Accept & Generate Meet
                    </button>
                    <button 
                      onClick={() => setRejectingMatchId(req.id)}
                      className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
                    >
                      <X size={16}/> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Sessions */}
      <div>
        <h3 className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Active Exchange Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {activeMatches.map((match) => (
            <div key={match.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-200 dark:hover:border-indigo-600 transition-colors">
              <div className="p-5 lg:p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-4">
                      <img src={match.partner.avatar} className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border border-slate-100 dark:border-slate-700 object-cover" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm lg:text-base truncate">{match.partner.name}</h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Verified Session
                        </span>
                      </div>
                   </div>
                   <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <TrendingUp size={18} />
                   </div>
                </div>
                
                <div className="flex flex-col gap-1 mb-6">
                   <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Topic for today</p>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{match.skillRequested}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => onStartSession(match)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs lg:text-sm shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    <Video size={18} />
                    <span>Open Gemini Proctor Room</span>
                  </button>
                  
                  {match.googleMeetLink && (
                    <a 
                      href={match.googleMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs lg:text-sm hover:bg-indigo-50 dark:hover:bg-slate-700"
                    >
                      <ExternalLink size={18} />
                      <span>Join via Google Meet</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activeMatches.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
               <p className="text-slate-400 dark:text-slate-500 font-medium">No active sessions yet. Start a barter to get learning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
