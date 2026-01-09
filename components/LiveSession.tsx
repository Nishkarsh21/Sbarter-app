
import React, { useState, useEffect, useRef } from 'react';
import { BarterMatch, SessionStatus, TerminationType } from '../types';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, AlertTriangle, ShieldAlert,
  Sparkles, UserCircle, Loader2, BrainCircuit, Activity, ExternalLink
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface LiveSessionProps {
  match: BarterMatch;
  onEnd: (terminationType: TerminationType) => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ match, onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [status, setStatus] = useState<SessionStatus>({
    isLearning: true,
    timeSpentOffTopic: 0,
    alertCount: 0,
    lastAlertTime: null,
    isTerminated: false
  });
  const [timer, setTimer] = useState(0);
  const [systemAnalysis, setSystemAnalysis] = useState("Gemini AI is analyzing the session quality...");
  const [focusScore, setFocusScore] = useState(100);
  const [isChecking, setIsChecking] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Simulated monitoring interval
  const monitorInterval = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    // Check every 20 seconds to ensure users are studying
    monitorInterval.current = setInterval(performAICheck, 20000); 

    return () => {
      clearInterval(interval);
      if (monitorInterval.current) clearInterval(monitorInterval.current);
    };
  }, []);

  const performAICheck = async () => {
    if (status.isTerminated || isChecking) return;
    
    setIsChecking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `You are monitoring a skill exchange session for "${match.skillRequested}" via Google Meet.
      Evaluate the session focus based on professional exchange standards.
      Return a JSON object:
      {
        "isFocused": boolean,
        "violationType": "none" | "off_topic" | "harassment" | "inactivity",
        "feedback": "Short encouraging message",
        "focusScore": number (0-100)
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      setSystemAnalysis(data.feedback || "Monitoring focus...");
      setFocusScore(data.focusScore || 100);

      if (!data.isFocused) {
        const newAlertCount = status.alertCount + 1;
        setStatus(prev => ({ 
          ...prev, 
          alertCount: newAlertCount, 
          isLearning: false 
        }));
        setShowWarning(true);

        if (newAlertCount >= 3) {
          const reason: TerminationType = data.violationType === 'harassment' ? 'teacher_fault' : 'learner_fault';
          setStatus(prev => ({ ...prev, isTerminated: true, terminationReason: reason }));
          setTimeout(() => onEnd(reason), 3000);
        }
      } else {
        setStatus(prev => ({ ...prev, isLearning: true }));
        setShowWarning(false);
      }
    } catch (e) {
      console.error("Gemini proctoring failed", e);
    } finally {
      setIsChecking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fadeIn overflow-hidden">
      {/* AI Proctor Bar */}
      <div className="h-16 lg:h-20 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <div className="hidden sm:block">
            <h3 className="text-white font-black text-sm tracking-tight uppercase">AI Proctoring Enabled</h3>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
              Session Validated by Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Exchange Focus</span>
             <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                   <div 
                    className={`h-full transition-all duration-1000 ${focusScore > 80 ? 'bg-emerald-500' : focusScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${focusScore}%` }}
                   ></div>
                </div>
                <span className="text-white font-mono text-xs font-bold">{focusScore}%</span>
             </div>
          </div>
          
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-white font-mono font-bold">{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 lg:p-6 flex flex-col lg:flex-row gap-4 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center border border-white/5 shadow-2xl p-8 lg:p-12">
          
          <div className="text-center max-w-xl">
             <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
                <VideoIcon className="text-indigo-400" size={40} />
             </div>
             <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter uppercase">Join your Class</h2>
             <p className="text-slate-400 text-base lg:text-lg mb-10 leading-relaxed font-medium">
                Please click the button below to join the Google Meet call with <span className="text-white font-bold">{match.partner.name}</span> for your session on <span className="text-indigo-400 font-bold">"{match.skillRequested}"</span>.
             </p>
             
             <a 
              href={match.googleMeetLink || 'https://meet.google.com'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-indigo-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-2xl shadow-white/10"
             >
                <ExternalLink size={24} />
                Launch Google Meet
             </a>
             
             <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
                Keep this tab open for AI validation and time tracking
             </p>
          </div>

          {showWarning && (
            <div className="absolute inset-0 bg-rose-500/40 backdrop-blur-sm z-30 flex items-center justify-center p-6 text-center animate-fadeIn">
              <div className="max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border-b-8 border-rose-500">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle size={32} />
                </div>
                <h4 className="text-slate-900 font-black text-2xl uppercase tracking-tighter">AI Focus Warning #{status.alertCount}</h4>
                <p className="text-slate-600 text-sm mt-4 leading-relaxed font-medium">
                  Gemini has detected potential off-topic behavior in your Meet session.
                  <br/><span className="font-black text-rose-600">Please return to the curriculum immediately.</span>
                </p>
                <button 
                  onClick={() => setShowWarning(false)} 
                  className="mt-8 w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-transform shadow-xl"
                >
                  Understood
                </button>
              </div>
            </div>
          )}

          {status.isTerminated && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
              <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-2xl shadow-rose-500/20">
                <ShieldAlert className="text-white" size={48} />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">BARTER VOIDED BY AI</h2>
              <p className="text-slate-400 text-base max-w-sm mb-10 leading-relaxed font-medium">
                Gemini AI has terminated this session for non-educational behavior. Credits are being penalized.
              </p>
              <div className="bg-white/5 px-8 py-5 rounded-3xl border border-white/10 flex items-center gap-4">
                 <Loader2 size={24} className="text-indigo-400 animate-spin" />
                 <span className="text-white font-black uppercase tracking-widest text-xs">Processing Penalty...</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar View */}
        <div className="h-48 lg:h-full lg:w-80 flex flex-row lg:flex-col gap-4 shrink-0">
          <div className="w-1/2 lg:w-full h-full lg:h-56 bg-slate-900 rounded-[2rem] relative overflow-hidden border border-white/5 shadow-xl p-6 flex flex-col justify-center text-center">
             <img src={match.partner.avatar} className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl mx-auto mb-4 border border-white/10" />
             <h4 className="text-white font-black text-sm truncate">{match.partner.name}</h4>
             <p className="text-indigo-400 text-[10px] font-bold uppercase mt-1">Teaching {match.skillRequested}</p>
          </div>

          <div className="w-1/2 lg:w-full h-full flex-1 bg-slate-900 rounded-[2rem] p-6 border border-white/5 flex flex-col relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-6">
               <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={12} className="animate-spin-slow" /> AI Feedback
               </p>
               {isChecking && <Loader2 size={12} className="text-white/30 animate-spin" />}
            </div>
            
            <div className="flex-1">
              <p className="text-white text-xs lg:text-sm font-bold leading-relaxed italic opacity-90 border-l-2 border-indigo-500 pl-4 py-2 bg-indigo-500/5 rounded-r-xl">
                "{systemAnalysis}"
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Infraction Meter</span>
                 <span className="text-[10px] font-black text-rose-500">{status.alertCount} / 3 Alerts</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${status.alertCount === 0 ? 'bg-emerald-500' : status.alertCount === 1 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${(status.alertCount / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-center px-6 gap-4 shrink-0">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-2xl transition-all active:scale-90 shadow-xl ${isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button 
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-4 rounded-2xl transition-all active:scale-90 shadow-xl ${!isVideoOn ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          {!isVideoOn ? <VideoOff size={24} /> : <VideoIcon size={24} />}
        </button>
        
        <div className="w-px h-10 bg-white/10 mx-4"></div>
        
        <button 
          onClick={() => onEnd('normal')}
          className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-2xl shadow-rose-900/40 transition-all uppercase tracking-tight text-sm"
        >
          <PhoneOff size={20} />
          <span>Exit Session</span>
        </button>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveSession;
