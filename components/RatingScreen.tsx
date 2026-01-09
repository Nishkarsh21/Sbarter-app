
import React, { useState, useEffect } from 'react';
import { BarterMatch } from '../types';
import { Star, MessageSquare, ArrowRight, CheckCircle, Sparkles, Coins } from 'lucide-react';

interface RatingScreenProps {
  match: BarterMatch;
  onFinish: (rating: number, feedback: string) => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ match, onFinish }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Determine reward/cost
  const isTeaching = match.skillOffered && match.skillOffered !== 'TBD';
  const rewardAmount = isTeaching ? 2 : -1;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onFinish(rating, feedback), 2500);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto h-[60vh] flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center relative z-10 animate-bounce">
            <CheckCircle size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Awesome!</h2>
        <p className="text-slate-500 mb-6 px-10">Your feedback helps {match.partner.name} and our whole community.</p>
        
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-xl flex items-center gap-4 animate-scaleIn">
          <div className={`p-2 rounded-xl ${rewardAmount > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}>
            <Coins size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Wallet Sync</p>
            <p className="font-bold">{rewardAmount > 0 ? `+${rewardAmount} Credits Earned!` : `${rewardAmount} Credit Deducted`}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 lg:p-10 text-center relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Sparkles size={160} />
        </div>

        <div className="relative inline-block mb-6">
          <img src={match.partner.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-xl mx-auto" />
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white">
             <Star size={16} fill="white" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 leading-tight">Rate your session</h2>
        <p className="text-slate-500 mt-2 px-4">How was your exchange with <span className="font-bold text-slate-800">{match.partner.name}</span>?</p>

        <div className="flex items-center justify-center gap-3 my-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-all active:scale-75 hover:scale-110"
            >
              <Star 
                size={40} 
                className={`${(hover || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`}
              />
            </button>
          ))}
        </div>

        <div className="text-left space-y-2 mb-8">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
            <MessageSquare size={14} /> Review (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you learned or share some tips for them..."
            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] transition-all"
          />
        </div>

        <button
          disabled={rating === 0}
          onClick={handleSubmit}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale text-white font-black text-lg rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 group"
        >
          <span>Submit Review</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {isTeaching ? '✨ Teaching Bonus: +2 Credits' : '📚 Learning Cost: 1 Credit'}
        </p>
      </div>
    </div>
  );
};

export default RatingScreen;
