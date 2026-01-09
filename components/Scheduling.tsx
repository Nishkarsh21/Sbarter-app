
import React, { useState } from 'react';
import { User } from '../types';
import { Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react';

interface SchedulingProps {
  partner: User;
  onFinalize: (time: string) => void;
  onBack: () => void;
}

const SLOTS = ["Mon, 10:00 AM", "Mon, 04:00 PM", "Tue, 11:30 AM", "Wed, 02:00 PM", "Fri, 09:00 AM"];

const Scheduling: React.FC<SchedulingProps> = ({ partner, onFinalize, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600">
        <ArrowLeft size={18} /> Back to partners
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-10 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
           <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Request Accepted!</h2>
        <p className="text-slate-500 mt-2">
          {partner.name} is ready for the exchange. Select your preferred time slot to start the barter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 text-left">
          {SLOTS.map(slot => (
            <button 
              key={slot}
              onClick={() => setSelected(slot)}
              className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${selected === slot ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'}`}
            >
              <div className={`p-2 rounded-lg ${selected === slot ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                 <Clock size={18} />
              </div>
              <span className={`font-bold ${selected === slot ? 'text-indigo-800' : 'text-slate-700'}`}>{slot}</span>
            </button>
          ))}
        </div>

        <button 
          disabled={!selected}
          onClick={() => onFinalize(selected!)}
          className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xl rounded-[2rem] shadow-xl shadow-indigo-100 transition-all"
        >
          Confirm Final Session
        </button>
      </div>
    </div>
  );
};

export default Scheduling;
