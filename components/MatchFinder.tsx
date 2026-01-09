
import React from 'react';
import { User, BarterMatch } from '../types';
import { MOCK_USERS } from '../constants';
import { Sparkles, MessageSquare, Plus } from 'lucide-react';

interface MatchFinderProps {
  user: User;
  onSendInvite: (match: BarterMatch) => void;
}

const MatchFinder: React.FC<MatchFinderProps> = ({ user, onSendInvite }) => {
  // Simple matching logic: find users who teach what I want to learn 
  // OR who want to learn what I teach
  const potentialMatches = MOCK_USERS.map(otherUser => {
    const teachingMatch = user.skillsToLearn.filter(s => otherUser.skillsToTeach.includes(s));
    const learningMatch = user.skillsToTeach.filter(s => otherUser.skillsToLearn.includes(s));
    
    return {
      user: otherUser,
      teachingMatch,
      learningMatch,
      score: teachingMatch.length + learningMatch.length
    };
  }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-amber-300" />
          Smart Matchmaker
        </h2>
        <p className="text-indigo-100 opacity-90 max-w-xl">
          We've analyzed the latest responses from the database to find your perfect barter partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {potentialMatches.map(({ user: partner, teachingMatch, learningMatch }) => (
          <div key={partner.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <img src={partner.avatar} className="w-16 h-16 rounded-2xl border-4 border-slate-50 shadow-sm" />
                <div className="text-right">
                  <div className="flex items-center justify-end text-amber-500 text-sm font-bold">
                    <span>4.9</span>
                    <Sparkles size={14} className="ml-1" />
                  </div>
                  <p className="text-xs text-slate-400">24 Reviews</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{partner.name}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{partner.bio}</p>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">You can learn</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingMatch.map(skill => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">They want to learn</p>
                  <div className="flex flex-wrap gap-2">
                    {learningMatch.map(skill => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onSendInvite({ 
                  id: Math.random().toString(), 
                  partner, 
                  skillOffered: learningMatch[0] || 'TBD', 
                  skillRequested: teachingMatch[0] || 'TBD',
                  status: 'pending' 
                })}
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <Plus size={18} />
                <span>Send Barter Request</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchFinder;
