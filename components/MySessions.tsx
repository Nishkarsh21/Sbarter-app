
import React, { useState } from 'react';
import { User, BarterMatch } from '../types';
import { MOCK_USERS } from '../constants';
import { 
  Video, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  History, 
  Play, 
  MoreVertical,
  Star,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface MySessionsProps {
  user: User;
  onStartSession: (match: BarterMatch) => void;
}

const MySessions: React.FC<MySessionsProps> = ({ user, onStartSession }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');

  // Mock data for different session states
  const allSessions: BarterMatch[] = [
    {
      id: 's1',
      partner: MOCK_USERS[0], // Alex Chen
      skillOffered: 'Python',
      skillRequested: 'React',
      status: 'active',
      scheduledTime: 'Started 15m ago'
    },
    {
      id: 's2',
      partner: MOCK_USERS[1], // Sarah Miller
      skillOffered: 'SQL',
      skillRequested: 'Video Editing',
      status: 'active',
      scheduledTime: 'Starting in 10m'
    },
    {
      id: 's3',
      partner: MOCK_USERS[2], // Jordan Smith
      skillOffered: 'Python',
      skillRequested: 'UI/UX Design',
      status: 'accepted',
      scheduledTime: 'Tomorrow, 2:00 PM'
    },
    {
      id: 's4',
      partner: MOCK_USERS[0], // Alex Chen
      skillOffered: 'SQL',
      skillRequested: 'TypeScript',
      status: 'completed',
      scheduledTime: 'Oct 24, 2024'
    }
  ];

  const filteredSessions = allSessions.filter(s => {
    if (activeTab === 'active') return s.status === 'active';
    if (activeTab === 'upcoming') return s.status === 'accepted' || s.status === 'pending';
    if (activeTab === 'past') return s.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 w-fit">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: Calendar },
          { id: 'active', label: 'In Session', icon: Play },
          { id: 'past', label: 'History', icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {allSessions.filter(s => {
              if (tab.id === 'active') return s.status === 'active';
              if (tab.id === 'upcoming') return s.status === 'accepted' || s.status === 'pending';
              if (tab.id === 'past') return s.status === 'completed';
              return false;
            }).length > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                activeTab === tab.id ? 'bg-indigo-100' : 'bg-slate-200'
              }`}>
                {allSessions.filter(s => {
                  if (tab.id === 'active') return s.status === 'active';
                  if (tab.id === 'upcoming') return s.status === 'accepted' || s.status === 'pending';
                  if (tab.id === 'past') return s.status === 'completed';
                  return false;
                }).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div 
              key={session.id} 
              className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-200 transition-all shadow-sm"
            >
              {/* Profile/Partner Info */}
              <div className="flex items-center gap-4 w-full md:w-64 shrink-0">
                <img 
                  src={session.partner.avatar} 
                  className="w-14 h-14 rounded-2xl border-2 border-slate-100 shadow-sm object-cover" 
                />
                <div className="truncate">
                  <h4 className="font-black text-slate-900 truncate">{session.partner.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {session.partner.rating}
                  </div>
                </div>
              </div>

              {/* Skills Info */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <GraduationCap size={12} className="text-indigo-400" /> Teaching
                  </span>
                  <span className="text-sm font-bold text-slate-700">{session.skillOffered}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <BookOpen size={12} className="text-emerald-400" /> Learning
                  </span>
                  <span className="text-sm font-bold text-slate-700">{session.skillRequested}</span>
                </div>
              </div>

              {/* Status & Time */}
              <div className="w-full md:w-48 text-center md:text-left shrink-0">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{session.scheduledTime}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider inline-block ${
                  session.status === 'active' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 
                  session.status === 'completed' ? 'bg-slate-100 text-slate-500' : 
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {session.status === 'active' ? 'Ongoing' : session.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {session.status === 'active' ? (
                  <button 
                    onClick={() => onStartSession(session)}
                    className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                  >
                    <Video size={18} />
                    <span>Join Session</span>
                  </button>
                ) : session.status === 'completed' ? (
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                    <CheckCircle size={20} />
                  </button>
                ) : (
                  <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                    Reschedule
                  </button>
                )}
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 bg-white rounded-[3rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No {activeTab} sessions</h3>
            <p className="text-slate-500 text-sm max-w-xs px-10">
              When you find exchange partners, your scheduled calls and history will appear here.
            </p>
            <button className="mt-8 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">
              Find Partners
            </button>
          </div>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="mt-12 p-8 bg-indigo-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-500">
           <History size={160} />
        </div>
        <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center relative z-10">
          <Clock size={32} className="text-indigo-300" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h4 className="text-xl font-black mb-1">Session Attendance Policy</h4>
          <p className="text-indigo-300 text-sm leading-relaxed max-w-xl">
            Arriving 5 minutes early is recommended. If a session is terminated by our AI moderator for lack of focus, credits will not be rewarded to the teacher and will still be deducted from the learner.
          </p>
        </div>
        <div className="md:ml-auto relative z-10">
           <button className="px-6 py-3 bg-white text-indigo-900 font-black rounded-2xl whitespace-nowrap hover:bg-indigo-50 transition-colors">
             Full Rules
           </button>
        </div>
      </div>
    </div>
  );
};

export default MySessions;
